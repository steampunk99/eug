import React, { useState } from 'react';
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../ui/dialog";
import ApplicationForm from './Application';
import { useNavigate, useLocation } from 'react-router-dom';

const ApplyButton = ({ school }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

    // Handle dialog open/close
    const handleOpenChange = (open) => {
      setOpen(open);
    };
 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild >
        <Button size="sm" className="w-full bg-transparent text-foreground border-secondary-foreground md:w-auto" variant="outline" onClick={() => handleOpenChange(true)}>
          Apply Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <ApplicationForm 
          school={school} 
          onClose={() => setOpen(false)} 
          onOpenChange={handleOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ApplyButton;