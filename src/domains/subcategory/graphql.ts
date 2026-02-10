import { gql } from "graphql-request";

export const GET_SUBCATEGORIES = gql`
  query GetSubCategories($filters: SubCategoryFiltersInput) {
    subCategories(filters: $filters) {
      id
      name
      categories {
        id
        name
      }
      createdAt
    }
  }
`;

export const GET_SUBCATEGORY = gql`
  query GetSubCategory($id: String!) {
    subCategory(id: $id) {
      id
      name
      categories {
        id
        name
      }
      createdAt
    }
  }
`;

export const CREATE_SUBCATEGORY = gql`
  mutation CreateSubCategory($input: CreateSubCategoryInput!) {
    createSubCategory(input: $input) {
      id
      name
      categories {
        id
        name
      }
      createdAt
    }
  }
`;

export const UPDATE_SUBCATEGORY = gql`
  mutation UpdateSubCategory($id: String!, $input: UpdateSubCategoryInput!) {
    updateSubCategory(id: $id, input: $input) {
      id
      name
      categories {
        id
        name
      }
      createdAt
    }
  }
`;

export const DELETE_SUBCATEGORY = gql`
  mutation DeleteSubCategory($id: String!) {
    deleteSubCategory(id: $id)
  }
`;
