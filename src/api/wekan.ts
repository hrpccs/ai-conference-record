
//** wekan */

import { AnyDict } from "../utils";

// wekan process address
export const wekan_url="192.168.56.1:2000"
  
export interface Board {
  id: string;
  title?: string;
  slug?: string;
  archived?: boolean;
  archivedAt?: string;
  createdAt?: string;
  modifiedAt?: string;
  stars?: number;
  labels?: {
    _id: string;
    name: string;
    color: string;
  }[];
  members?: {
    userId: string;
    isAdmin: boolean;
    isActive: boolean;
    isNoComments: boolean;
    isCommentOnly: boolean;
    isWorker: boolean;
  }[];
  permission?: string;
  orgs?: {
    orgId: string;
    orgDisplayName: string;
    isActive: true;
  }[];
  teams?: {
    teamId: string;
    teamDisplayName: string;
    isActive: true;
  }[];
  color?: string;
  allowsCardCounterList?: boolean;
  allowsBoardMemberList?: boolean;
  description?: string;
  subtasksDefaultBoardId?: string;
  subtasksDefaultListId?: string;
  dateSettingsDefaultBoardId?: string;
  dateSettingsDefaultListId?: string;
  allowsSubtasks?: boolean;
  allowsAttachments?: boolean;
  allowsChecklists?: boolean;
  allowsComments?: boolean;
  allowsDescriptionTitle?: boolean;
  allowsDescriptionText?: boolean;
  allowsDescriptionTextOnMinicard?: boolean;
  allowsCardNumber?: boolean;
  allowsActivities?: boolean;
  allowsLabels?: boolean;
  allowsCreator?: boolean;
  allowsAssignee?: boolean;
  allowsMembers?: boolean;
  allowsRequestedBy?: boolean;
  allowsCardSortingByNumber?: boolean;
  allowsShowLists?: boolean;
  allowsAssignedBy?: boolean;
  allowsReceivedDate?: boolean;
  allowsStartDate?: boolean;
  allowsEndDate?: boolean;
  allowsDueDate?: boolean;
  presentParentTask?: string;
  receivedAt?: string;
  startAt?: string;
  dueAt?: string;
  endAt?: string;
  spentTime?: number;
  isOvertime?: boolean;
  type?: string;
  sort?: number;
}

export interface List {
  id: string;
  title?: string;
  starred?: boolean;
  archived?: boolean;
  archivedAt?: string;
  boardId?: string;
  swimlaneId?: string;
  createdAt?: string;
  sort?: number;
  width?: string;
  height?: string;
  updatedAt?: string;
  modifiedAt?: string;
  wipLimit?: {
    value: number;
    enabled: boolean;
    soft: boolean;
  };
  color?: string;
  type?: string;
}

export interface Swimlane {
  id: string;
  title?: string;
  archived?: boolean;
  archivedAt?: string;
  boardId?: string;
  createdAt?: string;
  sort?: number;
  color?: string;
  updatedAt?: string;
  modifiedAt?: string;
  type?: string;
}

export interface Card {
  boardId: string;
  listId: string;
  swimlaneId: string;
  id:string;
  title?: string;
  archived?: boolean;
  archivedAt?: string;
  parentId?: string;
  coverId?: string;
  color?: string;
  createdAt?: string;
  modifiedAt?: string;
  customFields?: any[];
  dateLastActivity?: string;
  description?: string;
  requestedBy?: string;
  assignedBy?: string;
  labelIds?: string[];
  members?: string[];
  assignees?: string[];
  receivedAt?: string;
  startAt?: string;
  dueAt?: string;
  endAt?: string;
  spentTime?: number;
  isOvertime?: boolean;
  userId?: string;
  sort?: number;
  subtaskSort?: number;
  type?: string;
  linkedId?: string;
  vote?: {
    question: string;
    positive: string[];
    negative: string[];
    end: string;
    public: boolean;
    allowNonBoardMembers: boolean;
  };
  poker?: {
    question: boolean;
    one: string[];
    two: string[];
    three: string[];
    five: string[];
    eight: string[];
    thirteen: string[];
    twenty: string[];
    forty: string[];
    oneHundred: string[];
    unsure: string[];
    end: string;
    allowNonBoardMembers: boolean;
    estimation: number;
  };
  targetId_gantt?: string[];
  linkType_gantt?: number[];
  linkId_gantt?: string[];
  cardNumber?: number;
}
export type CardSubmitted=string
export interface ListSubmitted{
  list_name:string;
  tasks:CardSubmitted;
}
export interface BoardSubmitted{
  project_name:string;
  lists:ListSubmitted;
}
export enum operation_type{
  create="create_task",
  modify="modify_task",
  delete="delete_task",
}
export interface backend_response{
  "operation_type":operation_type,
  "board_name":string,
  "swimlane_name"?:string,//可以忽略
  "list_name":string,
  "task_name":string,
  "description":string,
  "due_at":string,// YYYY-MM-DD[ mm:ss ]
  "spent":string,// eg: 2h[28m]
  
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
export interface LoginData {
  username?: string;
  email?: string;
  password: string;
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
export async function getBoardsForUser(baseURL:string,userId:string):Promise<Board[]> {
  return fetch(`https://${baseURL}/api/users/${userId}/boards`)
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

export async function getListsForBoard(baseURL:string,boardId:string):Promise<List[]> {
  return fetch(`https://${baseURL}/api/boards/${boardId}/lists`)
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
export async function getCardsBySwimlane(baseURL:string,boardId:string, swimlaneId:string, token:string):Promise<Card[]> {
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
  

  //TODO: suit with code
  interface InputData {
    project_name: string;
    list_id: string;
    card_id: string;
    task_id: string;
  }
  
  interface OutputData {
    project_name: string;
    lists: {
      list_id: string;
      tasks: {
        task_id: string;
        task_name: string;
      }[];
    }[];
  }
  
  export function categorizeCards(inputData: Card[]): OutputData {
    const outputData: OutputData = {
      project_name: "",
      lists: []
    };
  
    // Group the input data by project and list
    const groupedData = inputData.reduce((acc:AnyDict, data) => {
      const { project_name, list_id, card_id, task_id } = data;
      if (!acc[project_name]) {
        acc[project_name] = {};
      }
      if (!acc[project_name][list_id]) {
        acc[project_name][list_id] = [];
      }
      acc[project_name][list_id].push({ card_id, task_id });
      return acc;
    }, {});
  
    // Convert the grouped data into the output format
    outputData.project_name = inputData[0].project_name;
    for (const list_id in groupedData[outputData.project_name]) {
      const tasks = groupedData[outputData.project_name][list_id].map(
        ({ task_id, card_id }) => {
          return { task_id, task_name: `Task ${card_id}` };
        }
      );
      outputData.lists.push({ list_id, tasks });
    }
  
    return outputData;
  }

  export function convertToInputData(outputData: CardSubmitted): InputData[] {
    const inputData: InputData[] = [];
  
    // Iterate over the lists in the outputData and create InputData objects for each task
    outputData.lists.forEach((list) => {
      const { list_id, tasks } = list;
      tasks.forEach((task) => {
        const { task_id } = task;
        inputData.push({
          project_name: outputData.project_name,
          list_id,
          card_id: task_id,
          task_id
        });
      });
    });
  
    return inputData;
  }
