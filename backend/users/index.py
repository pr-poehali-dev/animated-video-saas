import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: dict, context) -> dict:
    '''API для управления пользователями'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            email = body.get('email')
            name = body.get('name', '')
            
            if not email:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'email required'})
                }
            
            cur.execute('''
                INSERT INTO users (email, name, subscription_plan)
                VALUES (%s, %s, 'demo')
                ON CONFLICT (email) DO UPDATE 
                SET name = EXCLUDED.name
                RETURNING *
            ''', (email, name))
            
            user = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(dict(user), default=str)
            }
        
        elif method == 'GET':
            email = event.get('queryStringParameters', {}).get('email')
            user_id = event.get('queryStringParameters', {}).get('id')
            
            if email:
                cur.execute('SELECT * FROM users WHERE email = %s', (email,))
            elif user_id:
                cur.execute('SELECT * FROM users WHERE id = %s', (user_id,))
            else:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'email or id required'})
                }
            
            user = cur.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'User not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(dict(user), default=str)
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'user_id required'})
                }
            
            updates = []
            params = []
            
            if 'name' in body:
                updates.append('name = %s')
                params.append(body['name'])
            if 'subscription_plan' in body:
                updates.append('subscription_plan = %s')
                params.append(body['subscription_plan'])
            if 'subscription_expires_at' in body:
                updates.append('subscription_expires_at = %s')
                params.append(body['subscription_expires_at'])
            
            if not updates:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'No fields to update'})
                }
            
            params.append(user_id)
            query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s RETURNING *"
            cur.execute(query, params)
            
            user = cur.fetchone()
            conn.commit()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': headers,
                    'body': json.dumps({'error': 'User not found'})
                }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(dict(user), default=str)
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
