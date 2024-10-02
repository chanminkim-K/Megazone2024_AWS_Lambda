export default class APIHandler {
  constructor() {
    this.baseURL = 'https://rauxfq3477.execute-api.eu-west-2.amazonaws.com';  // Lambda API Gateway의 기본 URL
  }

  // 전체 카드 객체 리스트 반환. 없으면 NULL
  async getCards() {
    try {
      const response = await fetch(`${this.baseURL}/cards`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch cards');
      return await response.json();
    } catch (error) {
      console.error('Error fetching cards:', error);
      return null;
    }
  }

  // 카드 객체 생성/추가 후 ID 반환
  async postCard(cardObj) {
    try {
      const response = await fetch(`${this.baseURL}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardObj),
      });
      if (!response.ok) throw new Error('Failed to create card');
      const data = await response.json();
      return data.id;  // 새로 생성된 카드의 ID 반환
    } catch (error) {
      console.error('Error creating card:', error);
    }
  }

  // 카드 객체 수정
  async putCard(cardObj) {
    try {
      const { id, ...rest } = cardObj;
      if (!id) throw new Error('ID가 없습니다.');
      const response = await fetch(`${this.baseURL}/cards/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rest),
      });
      if (!response.ok) throw new Error('Failed to update card');
    } catch (error) {
      console.error('Error updating card:', error);
    }
  }

  // 카드 객체 삭제
  async deleteCard(id) {
    try {
      const response = await fetch(`${this.baseURL}/cards/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete card');
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  }
}
