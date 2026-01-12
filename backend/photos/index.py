import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: dict, context) -> dict:
    '''API для управления фотографиями в проектах'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            project_id = body.get('project_id')
            photo_url = body.get('photo_url')
            photo_name = body.get('photo_name', 'photo.jpg')
            position = body.get('position', 0)
            
            if not project_id or not photo_url:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'project_id and photo_url required'})
                }
            
            cur.execute('''
                INSERT INTO project_photos (project_id, photo_url, photo_name, position)
                VALUES (%s, %s, %s, %s)
                RETURNING *
            ''', (project_id, photo_url, photo_name, position))
            
            photo = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(photo), default=str)
            }
        
        elif method == 'GET':
            project_id = event.get('queryStringParameters', {}).get('project_id')
            
            if not project_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'project_id required'})
                }
            
            cur.execute('''
                SELECT * FROM project_photos 
                WHERE project_id = %s 
                ORDER BY position
            ''', (project_id,))
            
            photos = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(p) for p in photos], default=str)
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': headers,
                'body': json.dumps({'error': 'Method not allowed'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()
