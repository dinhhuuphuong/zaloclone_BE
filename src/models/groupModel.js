import Joi from 'joi'
import dynamoClient from '~/config/dynamodb'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'

const GROUP_TABLE_NAME = 'groups'
const GROUP_MEMBER_TABLE_NAME = 'groupMembers'

const create = async (groupName, groupAvatar) => {
  try {
    const groupID = uuidv4()

    const info = {
      groupID,
      groupName,
      groupAvatar,
      createdAt: Date.now(),
      updatedAt: null,
      destroy: false
    }

    const params = {
      TableName: GROUP_TABLE_NAME,
      Item: info
    }

    await dynamoClient.put(params).promise()

    return info
  } catch (error) {
    throw new Error(error)
  }
}

const createGroupMembers = async (userID, groupID, members) => {
  try {
    const params = {
      RequestItems: {
        [GROUP_MEMBER_TABLE_NAME]: members.map((member) => {
          return {
            PutRequest: {
              Item: {
                groupID,
                memberID: member,
                role: member === userID ? 'admin' : 'member',
                createdAt: Date.now(),
                updatedAt: null,
                destroy: false
              }
            }
          }
        })
      }
    }

    await dynamoClient.batchWrite(params).promise()
    return true
  } catch (error) {
    throw new Error(error)
  }
}

const addMembers = async (groupID, members) => {
  try {
    const params = {
      RequestItems: {
        [GROUP_MEMBER_TABLE_NAME]: members.map((member) => {
          return {
            PutRequest: {
              Item: {
                groupID,
                memberID: member,
                role: 'member',
                createdAt: Date.now(),
                updatedAt: null,
                destroy: false
              }
            }
          }
        })
      }
    }

    await dynamoClient.batchWrite(params).promise()
    return true
  } catch (error) {
    throw new Error(error)
  }
}

const findGroupByID = async (groupID) => {
  try {
    const params = {
      TableName: GROUP_TABLE_NAME,
      Key: {
        groupID
      }
    }

    const result = await dynamoClient.get(params).promise()
    return result.Item
  } catch (error) {
    throw new Error(error)
  }
}

const findGroupMembersByID = async (groupID) => {
  try {
    const params = {
      TableName: GROUP_MEMBER_TABLE_NAME,
      KeyConditionExpression: 'groupID = :groupID',
      ExpressionAttributeValues: {
        ':groupID': groupID
      }
    }

    const result = await dynamoClient.query(params).promise()
    return result.Items
  } catch (error) {
    throw new Error(error)
  }
}

const leaveGroup = async (userID, groupID) => {
  try {
    const params = {
      TableName: GROUP_MEMBER_TABLE_NAME,
      Key: {
        groupID,
        memberID: userID
      },
      UpdateExpression: 'set destroy = :destroy',
      ExpressionAttributeValues: {
        ':destroy': true
      }
    }

    await dynamoClient.update(params).promise()
    return true
  } catch (error) {
    throw new Error(error)
  }
}

const deleteGroup = async (groupID) => {
  try {
    const params = {
      TableName: GROUP_TABLE_NAME,
      Key: {
        groupID
      },
      UpdateExpression: 'set destroy = :destroy',
      ExpressionAttributeValues: {
        ':destroy': true
      }
    }

    await dynamoClient.update(params).promise()
    return true
  } catch (error) {
    throw new Error(error)
  }
}

const grantAdmin = async (groupID, memberID) => {
  try {
    const promoteParams = {
      TableName: GROUP_MEMBER_TABLE_NAME,
      Key: { groupID, memberID },
      UpdateExpression: 'set role = :role',
      ExpressionAttributeValues: { ':role': 'admin' }
    }

    await dynamoClient.update(promoteParams).promise()
    return true
  } catch (error) {
    throw new Error(`grantAdmin error: ${error.message}`)
  }
}
export const groupModel = {
  create,
  createGroupMembers,
  addMembers,
  findGroupByID,
  findGroupMembersByID,
  leaveGroup,
  deleteGroup,
  grantAdmin
}
