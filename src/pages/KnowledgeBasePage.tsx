
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { fetchKnowledgeLists, KnowledgeList, fetchCompanyInfo, CompanyInfoSection } from "@/services/knowledgeBaseService";
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  PlusSquare, 
  Save,
  BookOpen,
  Tag,
  CalendarClock,
  ListTodo
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

const KnowledgeBasePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'lists';
  
  const [lists, setLists] = useState<KnowledgeList[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [listsData, infoData] = await Promise.all([
          fetchKnowledgeLists(),
          fetchCompanyInfo()
        ]);
        
        setLists(listsData);
        setCompanyInfo(infoData);
      } catch (error) {
        console.error("Error loading knowledge base data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Group company info by category
  const companyInfoByCategory = companyInfo.reduce((acc, info) => {
    if (!acc[info.category]) {
      acc[info.category] = [];
    }
    acc[info.category].push(info);
    return acc;
  }, {} as Record<string, CompanyInfoSection[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground">
            Manage the knowledge that powers your AI agents
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="lists">
            <ListTodo className="h-4 w-4 mr-2" />
            Lists
          </TabsTrigger>
          <TabsTrigger value="company">
            <BookOpen className="h-4 w-4 mr-2" />
            Company Info
          </TabsTrigger>
        </TabsList>
        
        {/* Lists Tab */}
        <TabsContent value="lists" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Knowledge List</DialogTitle>
                  <DialogDescription>
                    Create a new list to store related information for your AI agents.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">List Name</Label>
                    <Input id="name" placeholder="e.g., Amenities, House Rules, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Brief description of what this list contains"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button>Create List</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="py-12 text-center">
              <p>Loading knowledge lists...</p>
            </div>
          ) : lists.length === 0 ? (
            <Card>
              <CardContent className="py-12 flex flex-col items-center justify-center">
                <ListTodo className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Knowledge Lists Found</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Create your first knowledge list to provide information to your AI agents
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New List
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Dialog content same as above */}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {lists.map((list) => (
                <Card key={list.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-guestfy-500" />
                        {list.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{list.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <CalendarClock className="h-3 w-3" /> 
                      Updated {new Date(list.updatedAt).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md">
                      <div className="p-4 border-b bg-muted/50 flex justify-between items-center">
                        <h4 className="font-medium">List Items ({list.items.length})</h4>
                        <Button size="sm" variant="ghost">
                          <PlusSquare className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                      <ul className="divide-y">
                        {list.items.map((item) => (
                          <li key={item.id} className="p-3 flex justify-between items-center">
                            <span>{item.value}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Company Info Tab */}
        <TabsContent value="company" className="space-y-6 mt-6">
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Company Info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Company Information</DialogTitle>
                  <DialogDescription>
                    Add new information about your company or property.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="e.g., Check-in Instructions" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="e.g., Arrival, Policies, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Add the detailed information"
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button>Save Information</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {isLoading ? (
            <div className="py-12 text-center">
              <p>Loading company information...</p>
            </div>
          ) : companyInfo.length === 0 ? (
            <Card>
              <CardContent className="py-12 flex flex-col items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Company Information Found</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Add company information that your AI agents can use to assist guests
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Company Info
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    {/* Dialog content same as above */}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(companyInfoByCategory).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-guestfy-500" />
                      {category}
                    </CardTitle>
                    <CardDescription>
                      {items.length} information {items.length === 1 ? 'entry' : 'entries'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {items.map((info) => (
                        <AccordionItem key={info.id} value={info.id}>
                          <AccordionTrigger className="hover:bg-muted/50 px-4">
                            <div className="flex items-center justify-between w-full pr-4">
                              <span>{info.title}</span>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="border rounded-md p-4 bg-muted/30 whitespace-pre-wrap">
                              {info.content}
                            </div>
                            <div className="flex justify-end mt-4">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Content
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Information</DialogTitle>
                                    <DialogDescription>
                                      Update the content for "{info.title}".
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-title-${info.id}`}>Title</Label>
                                      <Input 
                                        id={`edit-title-${info.id}`} 
                                        defaultValue={info.title} 
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-category-${info.id}`}>Category</Label>
                                      <Input 
                                        id={`edit-category-${info.id}`} 
                                        defaultValue={info.category} 
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor={`edit-content-${info.id}`}>Content</Label>
                                      <Textarea 
                                        id={`edit-content-${info.id}`} 
                                        defaultValue={info.content}
                                        className="min-h-[150px]"
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button>
                                      <Save className="mr-2 h-4 w-4" />
                                      Save Changes
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add to {category}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        {/* Add to category dialog content */}
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBasePage;
