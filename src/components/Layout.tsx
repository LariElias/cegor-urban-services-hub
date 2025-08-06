
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { RightUseInfo } from './RightUseInfo';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header 
              className="h-16 w-100 flex 
              items-center justify-between border-b bg-card px-6 shadow-sm"
          >
              <SidebarTrigger className="p-2 hover:bg-muted rounded-md lg:hidden" />
              <Breadcrumb />
              <RightUseInfo />
          </header>
          <main className="flex-1 p-6 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
