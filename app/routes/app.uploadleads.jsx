import React, { useState, useCallback } from 'react';
import {
  BlockStack,
  Button,
  Card,
  Text,
  Page,
  Modal,
  TextField,
  DropZone,
  Thumbnail,
  DataTable,
  LegacyStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import { NoteIcon } from '@shopify/polaris-icons';

// import prisma db
import db from "../db.server";

import { useLoaderData, Form } from "@remix-run/react";
import { useLocation } from 'react-router-dom';

export async function loader({ request }) {
  const location = new URL(request.url);
  const searchParams = location.searchParams;
  const groupId = searchParams.get('group_id');
  
  // Fetch group name from the database using the provided groupId
  const groupName = await db.leadgroups.findUnique({
    where: {
      id: parseInt(groupId)
    },
    select: {
      groupName: true
    }
  });

  // Fetch saved files from the database
  const savedFiles = await db.uploadedfiles.findMany({
    where: {
      groupId: parseInt(groupId)
    },
    select: {
      fileName: true,
      createdOn: true
    }
  });
  
  return json({ groupName: groupName.groupName, savedFiles });
}

export async function action({ request }) {
  let leadGroupsData = await request.formData();
  leadGroupsData = Object.fromEntries(leadGroupsData);

  // create new lead group record
  let newLeadGroup = await db.leadgroups.create({
    data: {
      groupName: leadGroupsData.groupName,
      groupDescription: leadGroupsData.groupDescription
    }
  });

  return json({ message: "New directory created", data: leadGroupsData });
}

function DropZoneExample({ setCSVData }) {
  const [file, setFile] = useState();

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvData = event.target.result;
        setFile(acceptedFiles[0]);
        setCSVData(csvData);
      };
      reader.readAsText(acceptedFiles[0]);
    },
    [setCSVData],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFiles = file && (
    <LegacyStack alignment="center">
      <Thumbnail
        size="large"
        alt={file.name}
        source={
          validImageTypes.includes(file.type)
            ? window.URL.createObjectURL(file)
            : "https://i.pinimg.com/564x/65/4d/01/654d01382e9d9f6b69a8c67f0ffda699.jpg"
        }
      />
      <div style={{
        padding: 10,
        display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', // Center vertically
      }}>
        {file.name}{' '}
        <Text variant="bodySm" as="p">
          {file.size} bytes
        </Text>
      </div>
    </LegacyStack>
  );

  return (
    <DropZone
     accept='.csv, text/csv, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values'
     allowMultiple={false}
     label="Upload your CSV"
     onDrop={handleDropZoneDrop}>
      {uploadedFiles}
      {fileUpload}
    </DropZone>
  );
}

export default function UploadLeadsPage() {
  const [active, setActive] = useState(false);
  const [csvData, setCSVData] = useState('');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const groupId = searchParams.get('group_id');

  const handleModalChange = () => { setActive(!active); };
  
  // Access groupName from useLoaderData
  const { groupName, savedFiles } = useLoaderData();

  // Parse the CSV data and render in a table
  const renderCSVTable = () => {
    const rows = csvData.split('\n').map(row => row.split(','));
    const headers = rows.shift();
    return (
      <Card sectioned>
  <LegacyStack distribution="equalSpacing">
    <Text variant="bodyMd" as="span">
      Preview Uploaded File
    </Text>
    <Button variant="primary" onClick={() => handleSaveButtonClick(csvData)}>
      Save
    </Button>
  </LegacyStack>
  <br />
  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
    <DataTable
      columnContentTypes={headers.map(() => 'text')}
      headings={headers}
      rows={rows}
    />
  </div>
</Card>
    );
  };

  const handleSaveButtonClick = async (data) => {
    try {
      const response = await fetch('/api/uploadleads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData: data, groupId: groupId}), // Ensure data is properly stringified
      });
  
      if (response.ok) {
        console.log('CSV data saved successfully.');
        window.location.reload();
      } else {
        const responseData = await response.json();
        console.error('Failed to save CSV data:', responseData.message);
      }
    } catch (error) {
      console.error('Error saving CSV data:', error.message);
    }
  };
  
    
  return (
    <Page fullWidth title={groupName}
      // primaryAction={{
      //   content: 'Upload CSV',
      //   onAction: handleModalChange,
      // }}
      >
      <DropZoneExample setCSVData={setCSVData} />
      {csvData && (
        <div style={{ marginTop: '20px' }}>
          {renderCSVTable()}
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
      <Text variant="headingLg" as="h5">
        Saved Files
      </Text>
      </div>
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <Card sectioned>
          <div>
            <DataTable
              columnContentTypes={['text', 'datetime']}
              headings={['File Name', 'Created On']}
              rows={savedFiles.map(file => [file.fileName, new Date(file.createdOn).toLocaleString()])}
            />
          </div>
        </Card>
      </div>
      <Modal
        open={active}
        onClose={handleModalChange}
        title="Create a new leads directory"
      >
        <Modal.Section>
          <Form method='POST'>
            <BlockStack gap="400">
              <TextField
                label="Directory Name"
                value={groupName}
                name='groupName'
                autoComplete="off"
              />
              <TextField
                label="Directory Description"
                name='groupDescription'
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
