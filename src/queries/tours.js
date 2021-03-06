import gql from 'graphql-tag';

export const GET_TOURS = gql`
  query Tours($ids: [ID], $limit: Int, $offset: Int, $order: ToursOrder, $category: String) {
    tours(ids: $ids, limit: $limit, skip: $offset, order: $order, category: $category) {
      id
      name
      category {
        name
      }
      description
      mediaContents {
        contentType
        captionText
        copyright
        sourceUrl {
          url
        }
      }
      addresses {
        city
        street
        zip
        kind
      }
      contact {
        firstName
        lastName
        phone
        email
        fax
        webUrls {
          url
          description
        }
      }
      webUrls {
        url
        description
      }
      dataProvider {
        logo {
          url
        }
        name
      }
    }
  }
`;

export const GET_TOUR = gql`
  query Tour($id: ID!) {
    tour(id: $id) {
      id
      title: name
      category {
        name
      }
      categories {
        name
      }
      description
      mediaContents {
        contentType
        captionText
        copyright
        sourceUrl {
          url
        }
      }
      addresses {
        city
        street
        zip
        kind
        addition
      }
      contact {
        firstName
        lastName
        phone
        email
        fax
        webUrls {
          url
          description
        }
      }
      webUrls {
        url
        description
      }
      lengthKm
      dataProvider {
        logo {
          url
        }
        name
      }
      operatingCompany {
        name
        address {
          id
          kind
          addition
          street
          zip
          city
        }
        contact {
          firstName
          lastName
          phone
          email
          fax
          webUrls {
            url
            description
          }
        }
      }
    }
  }
`;
