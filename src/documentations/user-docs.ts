export const user_doc = {
    tags: [
        {
          name: "Users",
          description: "API for users in the system"
        }
      ],
      schemes: [
        "http",
        "https"
      ],
      consumes: [
        "application/json"
      ],
      produces: [
        "application/json"
      ],
    "paths": {
      "/users/create": {
        post: {
          tags: [
            "Users"
          ],
          description: "Create a new User",
          parameters: [
            {
              name: "user",
              in: "body",
              description: "Create a User",
              schema: {
                required: [
                  "email",
                  "fullName",
                  "password",
                  "address",
                  "phoneNumber",
                  "userType"
                ],
                properties: {
                  email: {
                    type: "string"
                  },
                  password: {
                    type: "string"
                  },
                  fullName: {
                    type: "string"
                  },
                  phoneNumber: {
                    type: "string"
                  },
                  userType: {
                    type: "string"
                  },
                  address: {
                    type: "object",
                    properties: {
                      country: {
                        type: "string"
                      },
                      countryCode: {
                        type: "string"
                      },
                      fullAddress: {
                        type: "string"
                      },
                      longitude: {
                        type: "string"
                      },
                      latitude: {
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          ],
          produces: [
            "application/json"
          ],
          responses: {
            
          }
        }
      },
    
      "/users/login": {
        post: {
          tags: [
            "Users"
          ],
          description: "Login a new User",
          parameters: [
            {
              name: "user",
              in: "body",
              description: "Login a User",
              schema: {
                required: [
                  "email",
                  "password"
                ],
                properties: {
                  "email": {
                    "type": "string"
                  },
                  password: {
                    type: "string"
                  }
                }
              }
            }
          ],
          produces: [
            "application/json"
          ],
          responses: {
            
          }
        }
      },
    
      "/users/get": {
        get: {
          tags: [
            "Users"
          ],
          parameters: [
            {
              name: "authorization",
              in: "header",
              type: "string",
              required: true
            }
          ],
          summary: "by passing Bearer token",
          responses: {
          }
        },
      },
    
      "/users/update": {
        post: {
          tags: [
            "Users"
          ],
          description: "update a User",
          parameters: [
            {
              name: "authorization",
              in: "header",
              type: "string",
              required: true
            },
            {
              name: "user",
              in: "body",
              description: "Update a User",
              schema: {
                properties: {
                  fullName: {
                    type: "string"
                  },
                }
              }
            }
          ],
          summary: "by passing Bearer token",
          produces: [
            "application/json"
          ],
          responses: {
            
          }
        }
      },
    
    },
      definitions: {
        User: {
          required: [
            "firstName",
            "email",
            "phoneNumber",
            "userType",
            "password"
          ],
          properties: {
            firstName: {
              type: "string"
            },
            email: {
              type: "string",
              uniqueItems: true
            },
            lastName: {
              type: "string"
            },
            password: {
              type: "string"
            },
            userType: {
              type: "string"
            },
            address: {
              type: "object",
              properties: {
                country: {
                  type: "string"
                },
                countryCode: {
                  type: "string"
                },
                fullAddress: {
                  type: "string"
                },
                longitude: {
                  type: "string"
                },
                latitude: {
                  type: "string"
                }
              }
            }
          }
        }
      }  
}