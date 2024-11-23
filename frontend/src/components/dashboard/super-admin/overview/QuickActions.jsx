import { Button } from "../../../ui/button"
import { PlusCircle, UserPlus, School, Settings, ActivitySquareIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboardIcon } from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const handleAddSchool = () => {
    navigate("/dashboard/superadmin/schools/new");
  };

  const handleAddAdmin = () => {
    navigate("/dashboard/superadmin/admins/new");
  };

  const handleManageSchools = () => {
    navigate("/dashboard/superadmin/schools");
  };

  const handleSettings = () => {
    navigate("/dashboard/superadmin/settings");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-emerald-500"><ActivitySquareIcon /></span> 
        <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
      </div>
      <p className="text-muted-foreground">
        Shortcuts</p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleAddSchool}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add School
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleAddAdmin}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleManageSchools}
        >
          <School className="mr-2 h-4 w-4" />
          Manage Schools
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleSettings}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  )
}
