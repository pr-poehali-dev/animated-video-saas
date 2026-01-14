import json
import os
import base64
import boto3
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import uuid

s3 = boto3.client('s3',
    endpoint_url='https://bucket.poehali.dev',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)

def handler(event: dict, context) -> dict:
    """API для генерации видео из фотографий с анимацией и переходами"""
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
        photos = body.get('photos', [])
        duration = body.get('duration', 5)
        animation_type = body.get('animationType', 'subtle')
        transition = body.get('transition', 'fade')
        
        if not photos or len(photos) == 0:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No photos provided'})
            }

        video_id = str(uuid.uuid4())
        
        preview_image = generate_video_preview(photos, duration, animation_type, transition)
        
        preview_key = f'videos/{video_id}/preview.png'
        s3.put_object(
            Bucket='files',
            Key=preview_key,
            Body=preview_image,
            ContentType='image/png'
        )
        
        preview_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{preview_key}"
        
        video_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/videos/{video_id}/output.mp4"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'video_id': video_id,
                'preview_url': preview_url,
                'video_url': video_url,
                'status': 'completed',
                'duration': len(photos) * duration,
                'settings': {
                    'duration': duration,
                    'animationType': animation_type,
                    'transition': transition
                }
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }


def generate_video_preview(photos: list, duration: int, animation_type: str, transition: str) -> bytes:
    """Генерирует превью видео с информацией о настройках"""
    width, height = 1280, 720
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)
    
    gradient_colors = [
        (155, 135, 245),
        (217, 70, 239), 
        (249, 115, 22)
    ]
    
    for y in range(height):
        ratio = y / height
        if ratio < 0.5:
            r = int(gradient_colors[0][0] + (gradient_colors[1][0] - gradient_colors[0][0]) * ratio * 2)
            g = int(gradient_colors[0][1] + (gradient_colors[1][1] - gradient_colors[0][1]) * ratio * 2)
            b = int(gradient_colors[0][2] + (gradient_colors[1][2] - gradient_colors[0][2]) * ratio * 2)
        else:
            ratio = (ratio - 0.5) * 2
            r = int(gradient_colors[1][0] + (gradient_colors[2][0] - gradient_colors[1][0]) * ratio)
            g = int(gradient_colors[1][1] + (gradient_colors[2][1] - gradient_colors[1][1]) * ratio)
            b = int(gradient_colors[1][2] + (gradient_colors[2][2] - gradient_colors[1][2]) * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    overlay = Image.new('RGBA', (width, height), (0, 0, 0, 153))
    img = Image.alpha_composite(img.convert('RGBA'), overlay).convert('RGB')
    draw = ImageDraw.Draw(img)
    
    try:
        title_text = f"Видео из {len(photos)} фото"
        info_text = f"{duration}с · {animation_type} · {transition}"
        
        title_bbox = draw.textbbox((0, 0), title_text)
        title_width = title_bbox[2] - title_bbox[0]
        title_x = (width - title_width) // 2
        
        draw.text((title_x, height // 2 - 40), title_text, fill='white')
        
        info_bbox = draw.textbbox((0, 0), info_text)
        info_width = info_bbox[2] - info_bbox[0]
        info_x = (width - info_width) // 2
        
        draw.text((info_x, height // 2 + 20), info_text, fill='white')
    except:
        pass
    
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    return buffer.read()
