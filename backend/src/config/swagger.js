const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description:
        'Production-minded RESTful Task & Project Management API with JWT authentication, Role-Based Access Control (RBAC), resource-level access control, task query filtering, and centralized validation.'
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT Bearer token in format: Bearer <token>'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d5ecb8b5c9c22b4c8e4011',
              description: 'User ObjectId'
            },
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            role: {
              type: 'string',
              enum: ['Admin', 'Member'],
              example: 'Member'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-30T04:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-30T04:30:00.000Z'
            }
          }
        },
        Project: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d5ecb8b5c9c22b4c8e4022',
              description: 'Project ObjectId'
            },
            name: {
              type: 'string',
              example: 'Q3 Product Launch'
            },
            description: {
              type: 'string',
              example: 'Initiative for product launch'
            },
            createdBy: {
              oneOf: [
                { type: 'string', example: '60d5ecb8b5c9c22b4c8e4011' },
                { $ref: '#/components/schemas/User' }
              ]
            },
            members: {
              type: 'array',
              items: {
                oneOf: [
                  { type: 'string', example: '60d5ecb8b5c9c22b4c8e4011' },
                  { $ref: '#/components/schemas/User' }
                ]
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-30T04:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-30T04:30:00.000Z'
            }
          }
        },
        Task: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60d5ecb8b5c9c22b4c8e4033',
              description: 'Task ObjectId'
            },
            title: {
              type: 'string',
              example: 'Implement API documentation'
            },
            description: {
              type: 'string',
              example: 'Add Swagger OpenAPI specifications'
            },
            status: {
              type: 'string',
              enum: ['To Do', 'In Progress', 'Done'],
              example: 'In Progress'
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              example: 'High'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-08-15T00:00:00.000Z'
            },
            creator: {
              oneOf: [
                { type: 'string', example: '60d5ecb8b5c9c22b4c8e4011' },
                { $ref: '#/components/schemas/User' }
              ]
            },
            assignee: {
              nullable: true,
              oneOf: [
                { type: 'string', example: '60d5ecb8b5c9c22b4c8e4011' },
                { $ref: '#/components/schemas/User' }
              ]
            },
            project: {
              oneOf: [
                { type: 'string', example: '60d5ecb8b5c9c22b4c8e4022' },
                { $ref: '#/components/schemas/Project' }
              ]
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-30T04:30:00.000Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-30T04:30:00.000Z'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'Password123!'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com'
            },
            password: {
              type: 'string',
              example: 'Password123!'
            }
          }
        },
        CreateProjectRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Mobile App Overhaul'
            },
            description: {
              type: 'string',
              example: 'Redesign user interfaces for mobile platforms'
            }
          }
        },
        UpdateProjectRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Mobile App Overhaul v2'
            },
            description: {
              type: 'string',
              example: 'Updated description for mobile redesign'
            }
          }
        },
        AddMemberRequest: {
          type: 'object',
          required: ['userId'],
          properties: {
            userId: {
              type: 'string',
              example: '60d5ecb8b5c9c22b4c8e4011',
              description: 'Target User ObjectId to add as member'
            }
          }
        },
        CreateTaskRequest: {
          type: 'object',
          required: ['title'],
          properties: {
            title: {
              type: 'string',
              example: 'Design Database Schemas'
            },
            description: {
              type: 'string',
              example: 'Setup mongoose schemas for User, Project, Task'
            },
            status: {
              type: 'string',
              enum: ['To Do', 'In Progress', 'Done'],
              example: 'To Do'
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              example: 'High'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-08-15T00:00:00.000Z'
            },
            assignee: {
              type: 'string',
              example: '60d5ecb8b5c9c22b4c8e4011'
            }
          }
        },
        UpdateTaskRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Design Database Schemas'
            },
            description: {
              type: 'string',
              example: 'Updated task description'
            },
            status: {
              type: 'string',
              enum: ['To Do', 'In Progress', 'Done'],
              example: 'In Progress'
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
              example: 'Medium'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              example: '2026-08-20T00:00:00.000Z'
            },
            assignee: {
              type: 'string',
              example: '60d5ecb8b5c9c22b4c8e4011'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully'
            },
            data: {
              type: 'object',
              nullable: true
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'An error occurred'
            },
            errors: {
              type: 'array',
              nullable: true,
              items: {
                type: 'object'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
