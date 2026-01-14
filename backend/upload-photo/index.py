import json
import os
import base64
import boto3
import uuid

s3 = boto3.client('s3',
    endpoint_url='https://bucket.poehali.dev',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)

def handler(event: dict, context) -> dict:
    """API для загрузки фотографий в S3 хранилище"""
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        body = json.loads(event.get('body', '{}'))
        file_data = body.get('file')
        file_name = body.get('fileName', 'photo.jpg')
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No file data provided'})
            }

        if file_data.startswith('data:'):
            file_data = file_data.split(',')[1]
        
        file_bytes = base64.b64decode(file_data)
        
        file_extension = file_name.split('.')[-1] if '.' in file_name else 'jpg'
        unique_id = str(uuid.uuid4())
        s3_key = f'photos/{unique_id}.{file_extension}'
        
        content_type = 'image/jpeg'
        if file_extension.lower() == 'png':
            content_type = 'image/png'
        elif file_extension.lower() == 'gif':
            content_type = 'image/gif'
        elif file_extension.lower() == 'webp':
            content_type = 'image/webp'
        
        s3.put_object(
            Bucket='files',
            Key=s3_key,
            Body=file_bytes,
            ContentType=content_type
        )
        
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{s3_key}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'url': cdn_url,
                'key': s3_key,
                'size': len(file_bytes),
                'fileName': file_name
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
