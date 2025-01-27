import { wire, LightningElement } from 'lwc';
import { gql, graphql } from 'lightning/uiGraphQLApi';

export default class RecordPickerHello extends LightningElement {
    selectedRecordId = '';
    contact;
    wireError;

    get variables() {
        return {
            selectedRecordId: this.selectedRecordId
        };
    }

    handleChange(event) {
        this.selectedRecordId = event.detail.recordId;
    }

    @wire(graphql, {
        query: gql`
            query searchContacts($selectedRecordId: ID) {
                uiapi {
                    query {
                        Contact(
                            where: { Id: { eq: $selectedRecordId } }
                            first: 1
                        ) {
                            edges {
                                node {
                                    Id
                                    Name {
                                        value
                                    }
                                    Phone {
                                        value
                                        displayValue
                                    }
                                    Title {
                                        value
                                    }
                                    Picture__c {
                                        value
                                        displayValue
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `,
        variables: '$variables'
    })
    wiredGraphQL({ data, errors }) {
        this.wireError = errors;
        if (errors || !data) {
            return;
        }

        const graphqlResults = data.uiapi.query.Contact.edges.map((edge) => ({
            Id: edge.node.Id,
            Name: edge.node.Name.value,
            Phone: edge.node.Phone.value,
            Picture__c: edge.node.Picture__c.value,
            Title: edge.node.Title.value
        }));

        this.contact = graphqlResults?.[0];
    }
}
