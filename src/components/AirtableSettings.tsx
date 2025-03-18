
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";

const formSchema = z.object({
  token: z.string().min(1, { message: "API token is required" }),
  baseId: z.string().min(1, { message: "Base ID is required" }),
  tableName: z.string().min(1, { message: "Table name is required" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AirtableSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AirtableSettings: React.FC<AirtableSettingsProps> = ({ open, onOpenChange }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      token: localStorage.getItem('airtable_token') || '',
      baseId: localStorage.getItem('airtable_base_id') || '',
      tableName: localStorage.getItem('airtable_table_name') || 'Mentors',
    },
  });

  const onSubmit = (data: FormValues) => {
    // Save to localStorage
    localStorage.setItem('airtable_token', data.token);
    localStorage.setItem('airtable_base_id', data.baseId);
    localStorage.setItem('airtable_table_name', data.tableName);

    toast.success('Airtable settings saved successfully');
    onOpenChange(false);
    window.location.reload(); // Reload to fetch with new credentials
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Airtable Configuration</DialogTitle>
          <DialogDescription>
            Enter your Airtable API credentials to connect to your mentor database.
            These will be stored in your browser's localStorage.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Token</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Enter your Airtable API token" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Your Airtable personal access token
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="baseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your Airtable Base ID" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    The ID of your Airtable base (starts with 'app')
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your Airtable Table Name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter only the table name without any view IDs or paths (e.g., "Mentors")
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-techstars-phosphor hover:bg-techstars-phosphor/90">
                Save Configuration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AirtableSettings;
