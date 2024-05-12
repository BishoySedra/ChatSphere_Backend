import Axios  from "axios";
import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { baseUrl } from "../helpers/urls";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const handleChange = (event) => {
    const { id, value } = event.target;
    if (id === "groupName") {
      setGroupName(value);
    } else if (id === "groupDescription") {
      setGroupDescription(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const url = `${baseUrl}/chats/groups/create`;
    Axios.post(url,
        {
            groupName: groupName,
            groupDescription: groupDescription,
            adminEmail: localStorage.getItem("email"),
        },
        {
            headers: {
            Authorization: localStorage.getItem("token"),
            },
        }
        )
        .then((res) => {
            //reload the page
            window.location.reload();
        })
        .catch((err) => console.log(err)
    )
    // Reset form fields if needed
    setGroupName("");
    setGroupDescription("");
  };

  return (
    <div>
      <Container
        className="w-75 mt-5 rounded-4 p-4"
        style={{ backgroundColor: "#135D66" }}
      >
        <h5 className="mb-4 text-light p-3 pb-0">Enter Group Name</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="groupName" className="p-3 pt-0">
            <Form.Control
              type="text"
              placeholder="Type here"
              value={groupName}
              onChange={handleChange}
            />
          </Form.Group>
          <h5 className="mb-4 text-light p-3 pb-0">Enter Group Description</h5>
          <Form.Group controlId="groupDescription" className="p-3 pt-0">
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Type here"
              style={{ maxHeight: "200px", overflowY: "auto" }}
              value={groupDescription}
              onChange={handleChange}
            />
          </Form.Group>
          <div className="row justify-content-end p-5">
            <Button type="submit" className="btn-light w-25" style={{ fontSize: "1.5rem" }}>Create Group</Button>
          </div>
        </Form>
      </Container>
    </div>
  );
}

export default CreateGroup;
