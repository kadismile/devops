import { string } from 'joi';

let envVariable = process.env.DOMAIN_URL || ''
let domainUrl: string[] = envVariable.split('//');

export const api_docs = {
  swagger: "2.0",
  info: {
    version: "v1.0.0",
    title: "Next-handle Api's",
    description: "this lists and describes next-handle api endpoint",
  },
  host:`${domainUrl[1]}`,
  basePath: "/api/v1",
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

  "/vendors/create": {
    post: {
      tags: [
        "Vendors"
      ],
      description: "Create a new Vendor",
      parameters: [
        {
          name: "vendor",
          in: "body",
          description: "Create a Vendor",
          schema: {
            required: [
              "email",
              "businessName",
              "password",
              "address",
              "phoneNumber",
              "businessAddress",
              "businessRegNumber",
              "businessOwner",
              "accounts"
            ],
            properties: {
              email: {
                type: "string"
              },
              password: {
                type: "string"
              },
              businessName: {
                type: "string"
              },
              businessOwner: {
                type: "string"
              },
              businessRegNumber: {
                type: "string"
              },
              phoneNumber: {
                type: "string"
              },
              businessAddress: {
                type: "object",
                properties: {
                  country: {
                    type: "string"
                  },
                  landMark: {
                    type: "string"
                  },
                  city: {
                    type: "string"
                  },
                  state: {
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
              },
              account: {
                type: "object",
                properties: {
                  bankName: {
                    type: "string"
                  },
                  accountNumber: {
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

  "/category/create": {
    post: {
      tags: [
        "Category"
      ],
      description: "Create a new Category",
      parameters: [
        {
          name: "authorization",
          in: "header",
          type: "string",
          required: true
        },
        {
          name: "category",
          in: "body",
          description: "Create a Category",
          schema: {
            required: [
              "name"
            ],
            properties: {
              name: {
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

  "/conditions/create": {
    post: {
      tags: [
        "Condition"
      ],
      description: "Create a new Category",
      parameters: [
        {
          name: "authorization",
          in: "header",
          type: "string",
          required: true
        },
        {
          name: "condition",
          in: "body",
          description: "Create a Condition",
          schema: {
            required: [
              "name"
            ],
            properties: {
              name: {
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

  "/products/variant/create": {
    post: {
      tags: [
        "Products"
      ],
      description: "Create a Product Variant",
      parameters: [
        {
          name: "authorization",
          in: "header",
          type: "string",
          required: true
        },
        {
          name: "product_variant",
          in: "body",
          description: "Create a Product Variant",
          schema: {
            required: [
              "name",
              "categoryId",
              "specifications"
            ],
            properties: {
              name: {
                type: "string"
              },
              categoryId: {
                type: "string"
              },
              specifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string"
                    }
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

  "/products/brand/create": {
    post: {
      tags: [
        "Products"
      ],
      description: "Create a Product Brand",
      parameters: [
        {
          name: "authorization",
          in: "header",
          type: "string",
          required: true
        },
        {
          name: "product_variant",
          in: "body",
          description: "Create a Product Variant",
          schema: {
            required: [
              "name",
              "productVariantId"
            ],
            properties: {
              name: {
                type: "string"
              },
              productVariantId: {
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

  "/products/create": {
    post: {
      tags: [
        "Products"
      ],
      "summary": "Uploads a file.",
      "consumes": [
        "multipart/form-data"
      ],
      description: "Create a new Product",
      parameters: [
        {
          name: "authorization",
          in: "header",
          type: "string",
          required: true
        },
        {
          "in": "formData",
          "name": "myImage",
          "type": "file",
          "required": true
        },
        {
          name: "product",
          in: "body",
          description: "Create a new Product",
          schema: {
            required: [
              "name",
              "description",
              "productVariantId",
              "price",
              "user",
              "vendor",
              "category",
              "productBrand",
              "specifications"
            ],
            properties: {
              name: {
                type: "string"
              },
              description: {
                type: "string"
              },
              productVariantId: {
                type: "string"
              },
              price: {
                type: "integer"
              },
              user: {
                type: "string"
              },
              vendor: {
                type: "string"
              },
              productBrand: {
                type: string
              },
              category: {
                type: "string"
              },
              specifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string"
                    }
                  }
                }
              },
              condition: {
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

  "/products": {
    get: {
      tags: [
        "Products"
      ],
      summary: "by passing Bearer token",
      responses: {
      }
    },
  },

  "/upload": {
    "post": {
      tags: [
        "Products"
      ],
      "summary": "Uploads a file.",
      "consumes": [
        "multipart/form-data"
      ],
      "parameters": [
        {
          "in": "formData",
          "name": "upfile1",
          "type": "file",
          "required": true
        },
        {
          "in": "formData",
          "name": "note",
          "type": "string",
          "required": false
        }
      ]
    }
  },

  "/paystack/banks": {
    get: {
      tags: [
        "Banks"
      ],
      description: "List Banks In Nigeria",
      parameters: [
        {
          name: "banks",
          in: "body",
          description: "List Banks",
        }
      ],
      produces: [
        "application/json"
      ],
      responses: {

      }
    }
  },
  "/paystack/resolve-account": {
    get: {
      tags: [
        "Banks"
      ],
      description: "Resolve Account Number",
      parameters: [
        {
          in: "query",
          name: "account_number",
          schema: {
            type: "string"
          },
          description: "a valid 10 digit account number"
        },
        {
          in: "query",
          name: "bank_code",
          schema: {
            type: "string"
          },
          description: "the bank code of the account number"
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
  /* definitions: {
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
  }  */ 
  
}