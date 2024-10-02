import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";  // DeleteCommand 사용

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "todo-db";  // DynamoDB 테이블 이름

export const handler = async (event) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',  // 모든 도메인 허용
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const id = event.pathParameters?.id;

        if (!id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: '경로에 id가 누락되었습니다.' }),
            };
        }

        const params = {
            TableName: tableName,
            Key: { id },  // 삭제할 카드의 ID
        };

        // DeleteCommand를 사용하여 카드 삭제
        const command = new DeleteCommand(params);
        await dynamo.send(command);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: '카드가 성공적으로 삭제되었습니다.' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: '카드를 삭제할 수 없습니다.', details: error.message }),
        };
    }
};
