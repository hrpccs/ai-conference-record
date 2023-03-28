
//** wekan */
// login
export interface LoginData {
  username?: string;
  email?: string;
  password: string;
}
export function extractDomainName(url: string): string {
  const regex = /^.*:\/\/?([\w.-]+).*$/i;
  const match = url.match(regex);
  if (match && match.length >= 2) {
    return match[1];
  } else {
    throw new Error("Invalid URL");
  }
}

export async function loginUser(baseURL:string,data: LoginData): Promise<string> {
  const response = await fetch(`https://${baseURL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Unable to login user");
  }

  const token = await response.text();
  return token;
}
// Retrieve Boards by user_id
export async function getBoardsForUser(baseURL:string,userId:string) {
  return fetch(`/api/users/${userId}/boards`)
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error(error);
      throw new Error("Unable to fetch boards for user");
    });
}
// Retrive Lists by board_id

export async function getListsForBoard(baseURL:string,boardId:string) {
  return fetch(`/api/boards/${boardId}/lists`)
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error(error);
      throw new Error("Unable to fetch lists for board");
    });
}

// Retrieve cards by swimlane id
export async function getCardsBySwimlane(baseURL:string,boardId:string, swimlaneId:string, token:string) {
    const response = await fetch(`http://localhost:3000/api/boards/${boardId}/swimlanes/${swimlaneId}/cards`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Failed to retrieve cards for swimlane ${swimlaneId}`);
    }
  }
  
  // Add Card to List-Board-Swimlane
export async function addCardToList(baseURL:string,boardId:string, listId:string, swimlaneId:string, title:string, description:string, token:string) {
    const data = { title, description, swimlaneId };
    const response = await fetch(`http://localhost:3000/api/boards/${boardId}/lists/${listId}/cards`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      const card = await response.json();
      return card;
    } else {
      throw new Error(`Failed to add card to board ${boardId}, list ${listId}, swimlane ${swimlaneId}`);
    }
  }
  
  // Update a card

export async function updateCard(baseURL:string,boardId:string, listId:string, cardId:string, title:string, description:string, token:string) {
    const data = { title, listId, description };
    const response = await fetch(`http://localhost:3000/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      const card = await response.json();
      return card;
    } else {
      throw new Error(`Failed to update card ${cardId} in board ${boardId}, list ${listId}`);
    }
  }
  
  // Delete a card
export async function deleteCard(boardId, listId, cardId, token) {
    const data = {  };
    const response = await fetch(`http://localhost:3000/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      return true;
    } else {
      throw new Error(`Failed to delete card ${cardId} in board ${boardId}, list ${listId}`);
    }
  }
  
  
