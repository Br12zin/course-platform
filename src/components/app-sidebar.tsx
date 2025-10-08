// import { Home, Settings, ChevronUp, User, LogOut, CreditCard, User2 } from "lucide-react"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// // Menu items.
// const items = [
//   {
//     title: "Início",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: "Configurações",
//     url: "#",
//     icon: Settings,
//   },
// ]

// export function AppSidebar() {
//   return (
//     <Sidebar className="h-screen flex flex-col">
//       <SidebarContent className="flex-1 overflow-y-auto pl-1">
//         <SidebarGroup>
//           <SidebarHeader>
//             <SidebarGroupLabel className="text-2xl mb-6">HSP</SidebarGroupLabel>
//           </SidebarHeader>
//           <SidebarGroupContent className="pl-10">
//             <SidebarMenu>
//               {items.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={item.url} className="flex items-center gap-2">
//                       <item.icon className="h-4 w-4" suppressHydrationWarning/>
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter className="border-t p-2">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuButton className="w-full h-full justify-start gap-3">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src="/avatars/default.png" />
//                     <AvatarFallback>US</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 text-left overflow-hidden">
//                     <p className="text-sm font-medium truncate">Nome do Usuário</p>
//                     <p className="text-xs text-muted-foreground truncate">usuario@email.com</p>
//                   </div>
//                   <ChevronUp className="h-4 w-4 text-muted-foreground" suppressHydrationWarning/>
//                 </SidebarMenuButton>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent 
//                 side="top" 
//                 align="start"
//                 className="w-[var(--radix-popper-anchor-width)]"
//               >
//                 <DropdownMenuItem>
//                   <User className="mr-2 h-4 w-4" />
//                   <span>Meu Perfil</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <Settings className="mr-2 h-4 w-4" />
//                   <span>Configurações</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem className="text-red-500 focus:text-red-500">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   <span>Sair</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   )
// }