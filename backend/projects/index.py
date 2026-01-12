import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: dict, context) -> dict:
    '''API для управления проектами видео'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
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
        
        if method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('user_id')
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id required'})
                }
            
            cur.execute('''
                SELECT p.*, 
                       COALESCE(json_agg(
                           json_build_object(
                               'id', pp.id,
                               'photo_url', pp.photo_url,
                               'photo_name', pp.photo_name,
                               'position', pp.position
                           ) ORDER BY pp.position
                       ) FILTER (WHERE pp.id IS NOT NULL), '[]') as photos
                FROM projects p
                LEFT JOIN project_photos pp ON p.id = pp.project_id
                WHERE p.user_id = %s
                GROUP BY p.id
                ORDER BY p.created_at DESC
            ''', (user_id,))
            
            projects = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps([dict(p) for p in projects], default=str)
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            title = body.get('title', 'Новый проект')
            duration = body.get('duration', 5)
            animation_type = body.get('animation_type', 'subtle')
            transition = body.get('transition', 'fade')
            thumbnail_emoji = body.get('thumbnail_emoji', '🎬')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id required'})
                }
            
            cur.execute('''
                INSERT INTO projects (user_id, title, duration, animation_type, transition, thumbnail_emoji)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
            ''', (user_id, title, duration, animation_type, transition, thumbnail_emoji))
            
            project = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(project), default=str)
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            project_id = event.get('pathParams', {}).get('id') or body.get('id')
            
            if not project_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'project_id required'})
                }
            
            updates = []
            params = []
            
            if 'title' in body:
                updates.append('title = %s')
                params.append(body['title'])
            if 'status' in body:
                updates.append('status = %s')
                params.append(body['status'])
            if 'video_url' in body:
                updates.append('video_url = %s')
                params.append(body['video_url'])
            
            if not updates:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            updates.append('updated_at = CURRENT_TIMESTAMP')
            params.append(project_id)
            
            query = f"UPDATE projects SET {', '.join(updates)} WHERE id = %s RETURNING *"
            cur.execute(query, params)
            
            project = cur.fetchone()
            conn.commit()
            
            if not project:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'Project not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(dict(project), default=str)
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
