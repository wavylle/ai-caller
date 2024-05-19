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

export async function loader() {
    // get data from database

    // currently loading from a local dictionary
    let campaignsData = await db.campaigns.findMany()

    console.log("CAMPAIGNS DATA: ", campaignsData)

    return json(campaignsData)
}

export async function action({request}) {
    let campaignsData = await request.formData()
    campaignsData = Object.fromEntries(campaignsData)

    // create new campaign record
    let newCampaign = await db.campaigns.create({
      data: {
        campaignName: campaignsData.campaignName,
        campaignDescription: campaignsData.campaignDescription
      }
    })

    return json({message: "New campaign created", data: campaignsData})
}

export default function CampaignsPage() {
  const [active, setActive] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setcampaignDescription] = useState('');

  const handleChange = (setter) => (value) => setter(value);
  const handleModalChange = () => {setActive(!active);}
  
  // getting campaigns data from database
  const campaignsData = useLoaderData()
  console.log(campaignsData)

  const handleSubmit = async () => {
    // Handle form submission logic here, for now just simulate a successful submission
    // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async submission

    setCampaignName('')
    setcampaignDescription('')
    
    // Close the modal after successful submission
    setActive(false);
  };

  console.log(campaignsData)

  let gridMarkup = ""
  let emptyStateMarkup = ""

  if (campaignsData.length <= 0) {
    emptyStateMarkup = <LegacyCard sectioned>
    <EmptyState
      heading="No Campaigns Created"
      action={{content: 'Create', onAction: handleModalChange}}
      // secondaryAction={{
      //   content: 'Learn more',
      //   url: 'https://help.shopify.com',
      // }}
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>You haven't created any campaigns yet. Get started now and have AI talk to your customers.</p>
    </EmptyState>
  </LegacyCard>
  }
  else {
  gridMarkup = campaignsData.map(
    (
        {id, campaignName, campaignDescription, createdOn},
        index,
    ) => (
        <Card roundedAbove="sm">
        <BlockStack gap="200">
        <Tooltip preferredPosition='below' content={campaignDescription}>
          <Text as="h6" variant="headingLg">
            📢 {campaignName}
          </Text><br />
        <Text as="p" tone='subdued'>#{id} • {new Date(createdOn).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
      </Tooltip>
          {/* <Badge>Fulfilled</Badge> */}
          <BlockStack gap="200">
            <Text as="h3" variant="headingSm" fontWeight="medium"></Text>
            <List>
              <List.Item>Total Leads: <strong>50</strong></List.Item>
              <List.Item>Total Calls: <strong>0</strong></List.Item>
              <List.Item>Success Rate: <strong>0%</strong></List.Item>
            </List>
          </BlockStack>
          <InlineStack align="end">
            <ButtonGroup>
              <Button
                variant="secondary"
                tone="critical"
                onClick={() => {}}
                accessibilityLabel="Cancel shipment"
              >
                Edit
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
    <Page fullWidth title="Campaigns"
    primaryAction={{
      content: 'Create a campaign',
      onAction: handleModalChange,
    }}>
    <InlineGrid gap="400" columns={3}>
      {gridMarkup}
    </InlineGrid>

    {emptyStateMarkup}


      <Modal
        open={active}
        onClose={handleModalChange}
        title="Create a new campaign"
      >
        <Modal.Section>
            <Form method='POST' onSubmit={handleSubmit}>
        <BlockStack gap="400">
          <TextField
            label="Campaign Name"
            value={campaignName}
            name='campaignName'
            onChange={handleChange(setCampaignName)}
            autoComplete="off"
            />
          <TextField
            label="Campaign Description"
            value={campaignDescription}
            name='campaignDescription'
            onChange={handleChange(setcampaignDescription)}
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
