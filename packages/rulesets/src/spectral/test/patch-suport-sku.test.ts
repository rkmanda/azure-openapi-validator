import { Spectral } from "@stoplight/spectral-core"
import linterForRule from "./utils"

let linter: Spectral

beforeAll(async () => {
  linter = await linterForRule("PatchSkuProperty")
  return linter
})

test("PatchSkuProperty should find errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          id: {
            type: "string",
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        description: "Test Description",
        properties: {
          id: {
            type: "string",
            readOnly: true,
          },
          name: {
            type: "string",
            readOnly: true,
          },
          type: {
            type: "string",
            readOnly: true,
          },
          sku: { $ref: "#/definitions/Sku" },
        },
        required: ["name"],
      },
      Sku: {
        description: "The resource model definition representing SKU",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          size: {
            type: "string",
          },
          family: {
            type: "string",
          },
          capacity: {
            type: "integer",
            format: "int32",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        allOf: [{ $ref: "#/definitions/Resource" }],
        properties: {
          provisioningState: {
            type: "string",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(1)
    expect(results[0].path.join(".")).toBe("paths./foo.patch.parameters.0")
    expect(results[0].message).toContain("The patch operation body parameter schema should contains property 'sku'.")
  })
})

test("PatchSkuProperty should find no errors", () => {
  const oasDoc = {
    swagger: "2.0",
    paths: {
      "/foo": {
        patch: {
          tags: ["SampleTag"],
          operationId: "Foo_Update",
          description: "Test Description",
          parameters: [
            {
              name: "foo_patch",
              in: "body",
              schema: {
                $ref: "#/definitions/FooRequestParams",
              },
            },
          ],
          responses: {
            "200": {
              description: "Success",
              schema: {
                $ref: "#/definitions/FooResource",
              },
            },
          },
        },
      },
    },
    definitions: {
      FooRequestParams: {
        allOf: [
          {
            $ref: "#/definitions/FooProps",
          },
        ],
      },
      FooProps: {
        properties: {
          sku: {
            $ref: "#/definitions/Sku",
          },
        },
      },
      Resource: {
        "x-ms-azure-resource": true,
        description: "Test Description",
        properties: {
          id: {
            type: "string",
            readOnly: true,
          },
          name: {
            type: "string",
            readOnly: true,
          },
          type: {
            type: "string",
            readOnly: true,
          },
          sku: { $ref: "#/definitions/Sku" },
        },

        required: ["name"],
      },
      Sku: {
        description: "The resource model definition representing SKU",
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          size: {
            type: "string",
          },
          family: {
            type: "string",
          },
          capacity: {
            type: "integer",
            format: "int32",
          },
        },
      },
      FooResource: {
        "x-ms-azure-resource": true,
        allOf: [{ $ref: "#/definitions/Resource" }],
        properties: {
          provisioningState: {
            type: "string",
            enum: ["Creating", "Canceled", "Deleting", "Failed"],
          },
        },
      },
    },
  }
  return linter.run(oasDoc).then((results) => {
    expect(results.length).toBe(0)
  })
})
