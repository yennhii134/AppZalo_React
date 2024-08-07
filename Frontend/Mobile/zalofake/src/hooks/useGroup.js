import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import useToast from "./useToast";

const useGroup = () => {
  const [group, setGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const { showToastError, showToastSuccess } = useToast();

  const createGroup = async (nameGroup, idUser) => {
    try {
      const response = await axiosInstance.post("/groups/create", {
        name: nameGroup,
        members: idUser,
      });
      if (response.status === 201) {
        showToastSuccess("Tạo nhóm thành công")
        return response.data;
      }
    } catch (error) {
      console.log("CreateGroupError:", error);
      showToastError("Tạo nhóm thất bại")
      return null;
    }
  };

  const getGroup = async (groupId) => {
    try {
      const response = await axiosInstance.get(`/groups/get/${groupId}`);
      const { data, status } = response;
      if (status === 200) {
        setGroup(data.group);
        return data
      }
    } catch (error) {
      console.error(error);
      return null
    }
  };

  const getGroups = async () => {
    try {
      const response = await axiosInstance.get("/groups/all");
      const { data, status } = response;
      if (status === 200) {
        setGroups(data);
        return data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await axiosInstance.delete(`/groups/delete/${groupId}`);
      const { status } = response;

      if (status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
      throw error;
    } 
  };



  const updateGroup = async (groupId, groupData) => {
    try {
      const response = await axiosInstance.put(
        `/groups/update/${groupId}`,
        groupData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Header cần thiết khi gửi dữ liệu dưới dạng multipart/form-data
          },
        }
      );
      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const addMember = async (groupId, members) => {
    try {
      const response = await axiosInstance.post(
        `/groups/addMembers/${groupId}`,
        members
      );
      const { data, status } = response;
      if (status === 200) {
        setGroup(data.group);
        return data.message;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeMember = async (groupId, memberData) => {
    try {
      const response = await axiosInstance.post(
        `/groups/removeMembers/${groupId}`,
        memberData
      );
      const { data, status } = response;
      if (status === 200) {
        setGroup(data.group);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  };
  const leaveGroup = async (groupId) => {
    try {
      const response = await axiosInstance.post(
        `/groups/leave/${groupId}`
      );
      const { data, status } = response;
      if (status === 200) {
        setGroup(data.group);
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addAdmin = async (groupData) => {
    try {
      const response = await axiosInstance.post(`/groups/changeAdmins`,
        groupData
      );

      if (response.status === 200) {
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changeAdmins = async (groupId, memberData) => {
    try {
      const response = await axiosInstance.post(
        "/groups/make-member-to-admin",
        {
          userId: memberData,
          groupId,
        }
      );
      const { data, status } = response;
      if (status === 200) {
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return {
    group,
    groups,
    createGroup,
    getGroup,
    getGroups,
    deleteGroup,
    updateGroup,
    addMember,
    removeMember,
    leaveGroup,
    addAdmin,
    changeAdmins
  };
};

export default useGroup;
