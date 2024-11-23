import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userService } from "@/services/userService";

const UserSearch = ({ onSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAllUsers();
        if (response?.data) {
          setUsers(response.data);
        } else {
          setError('No users found');
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSelect = (userId) => {
    const selectedUser = users.find(user => user._id === userId);
    if (selectedUser && onSelect) {
      onSelect(selectedUser);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!users.length) {
    return <div className="text-gray-500">No users found</div>;
  }

  return (
    <div className="w-full">
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user._id} value={user._id}>
              {user?.name || user?.email} ({user?.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserSearch;
