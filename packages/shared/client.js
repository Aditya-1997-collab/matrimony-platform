import client from "@/packages/shared/graphql/client";

const query = gql`
  query {
    allUsers {
      nodes {
        fullName
      }
    }
  }
`;

const data = await client.query({ query });
