export const vendor_doc = {
    tags: [
        {
          name: "Vendor",
          description: "API for vendors"
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
      "/vendors/create": {
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