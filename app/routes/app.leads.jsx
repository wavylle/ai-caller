import React, { useState } from 'react';
import {
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  InlineStack,
  List,
  Text,
  Page,
  InlineGrid,
  Modal,
  TextField,
  Tooltip,
  Badge,
  LegacyCard,
  EmptyState
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import {json} from "@remix-run/node"

// import prisma db
import db from "../db.server"

import {useLoaderData, Form} from "@remix-run/react"
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

export async function loader() {
    // get data from database

    // currently loading from a local dictionary
    let leadGroupsData = await db.leadgroups.findMany()

    return json(leadGroupsData)
}

export async function action({request}) {
    let leadGroupsData = await request.formData()
    leadGroupsData = Object.fromEntries(leadGroupsData)

    // create new lead group record
    let newLeadGroup = await db.leadgroups.create({
      data: {
        groupName: leadGroupsData.groupName,
        groupDescription: leadGroupsData.groupDescription
      }
    })

    return json({message: "New directory created", data: leadGroupsData})
}

export default function LeadGroupsPage() {
  const [active, setActive] = useState(false);
  const [groupName, setgroupName] = useState('');
  const [groupDescription, setgroupDescription] = useState('');

  const handleChange = (setter) => (value) => setter(value);
  const handleModalChange = () => {setActive(!active);}

  const navigate = useNavigate();

  const handleManageClick = (groupId) => {
    navigate(`/app/uploadleads?group_id=${groupId}`);
  };
  
  // getting lead groups data from database
  const leadGroupsData = useLoaderData()
  console.log(leadGroupsData)

  const handleSubmit = async () => {
    // Handle form submission logic here, for now just simulate a successful submission
    // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async submission

    setgroupName('')
    setgroupDescription('')
    
    // Close the modal after successful submission
    setActive(false);
  };

  console.log(leadGroupsData)

  let gridMarkup = ""
  let emptyStateMarkup = ""

  if (leadGroupsData.length <= 0) {
    emptyStateMarkup = <LegacyCard sectioned>
    <EmptyState
      heading="No Lead Directories Created"
      action={{content: 'Create', onAction: handleModalChange}}
      // secondaryAction={{
      //   content: 'Learn more',
      //   url: 'https://help.shopify.com',
      // }}
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>You haven't created any lead directories yet. Get started now and upload leads in the directory.</p>
    </EmptyState>
  </LegacyCard>
  }
  else {
  gridMarkup = leadGroupsData.map(
    (
        {id, groupName, groupDescription, createdOn},
        index,
    ) => (
        <Card roundedAbove="sm">
        <BlockStack gap="200">
        <Tooltip preferredPosition='below' content={groupDescription}>
          <Text as="h6" variant="headingLg">
            📄 {groupName}
          </Text><br />
        <Text as="p" tone='subdued'>#{id} • {new Date(createdOn).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
      </Tooltip>
          {/* <Badge>Fulfilled</Badge> */}
          <BlockStack gap="200">
            <Text as="h3" variant="headingSm" fontWeight="medium"></Text>
            <List>
              <List.Item>Total CSVs: <strong>5</strong></List.Item>
              <List.Item>Total Leads: <strong>455</strong></List.Item>
              {/* <List.Item>Success Rate: <strong>0%</strong></List.Item> */}
            </List>
          </BlockStack>
          <InlineStack align="end">
            <ButtonGroup>
              <Button
                variant="secondary"
                tone="critical"
                onClick={() => handleManageClick(id)}
                accessibilityLabel="Cancel shipment"
              >
                Manage
              </Button>
              <Button
                variant="primary"
                onClick={() => {}}
                accessibilityLabel="Add tracking number"
              >
                Delete
              </Button>
            </ButtonGroup>
          </InlineStack>
        </BlockStack>
      </Card>
    )
  )
}

  return (
    <Page fullWidth title="Leads"
    primaryAction={{
      content: 'Create a directory',
      onAction: handleModalChange,
    }}>
    <InlineGrid gap="400" columns={3}>
      {gridMarkup}
    </InlineGrid>

    {emptyStateMarkup}


      <Modal
        open={active}
        onClose={handleModalChange}
        title="Create a new leads directory"
      >
        <Modal.Section>
            <Form method='POST' onSubmit={handleSubmit}>
        <BlockStack gap="400">
          <TextField
            label="Directory Name"
            value={groupName}
            name='groupName'
            onChange={handleChange(setgroupName)}
            autoComplete="off"
            />
          <TextField
            label="Directory Description"
            value={groupDescription}
            name='groupDescription'
            onChange={handleChange(setgroupDescription)}
            multiline={4}
            autoComplete="off"
            />
            <Button variant='primary' submit={true}>Save</Button>
            </BlockStack>
            </Form>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
