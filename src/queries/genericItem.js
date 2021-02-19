import gql from 'graphql-tag';

export const GET_GENERIC_ITEMS = gql`
  query GenericItems {
    genericItems {
      id
      genericType
      title
      externalId
      companies {
        name
        address {
          addition
          street
          zip
          city
          geoLocation {
            latitude
            longitude
          }
        }
        contact {
          firstName
          lastName
          phone
          email
          webUrls {
            url
            description
          }
        }
      }
      contentBlocks {
        body
        mediaContents {
          contentType
          sourceUrl {
            url
          }
          captionText
        }
      }
      publicationDate
      publishedAt
      payload
    }
  }
`;
