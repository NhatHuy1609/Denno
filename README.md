# Denno - Task Management Application

**Denno** is a modern task management application inspired by Trello, designed to help teams organize, track, and manage their work efficiently.  
Think of it as a digital whiteboard with lists and cards, where each card represents a task that can include attachments, due dates, members, and more.

🔗 **Demo:** [https://denno-azure.vercel.app/](https://denno-azure.vercel.app/)

## ✨ Features

- 📋 **Boards & Lists** – Organize tasks visually with an intuitive board layout
- 👥 **Team Collaboration** – Work seamlessly with team members in real time
- ✅ **Task Tracking** – Add due dates, monitor progress, and stay on top of deadlines
- 🔔 **Real-time Notifications** – Get instant updates on project activities
- 🏢 **Workspace Management** – Create and manage multiple workspaces for different teams or projects
- 🧑‍🤝‍🧑 **Board Member Management** – Invite, assign roles, and manage board members
- 🎯 **Drag & Drop** – Rearrange tasks and lists easily with smooth drag-and-drop interactions

## 🛠 Tech Stack

### Frontend

- ⚛️ **Next.js** (React framework)
- 📘 **TypeScript**
- 📦 **Redux Toolkit** for state management
- 🔄 **TanStack Query** for server state and caching
- 🎨 **Tailwind CSS** for styling
- 📡 **SignalR Client** for real-time updates
- 🖱️ **dnd-kit** for drag-and-drop functionality

### Backend

- 🌐 **ASP.NET Core**
- 🗄️ **Entity Framework Core** (ORM)
- 💾 **SQL Server** as database
- 🔐 **ASP.NET Identity** for authentication & authorization
- ⚡ **SignalR** for real-time communication

## 🚀 Deploy

- 🟣 **Frontend:** Vercel – host the Next.js application directly from GitHub repository
- 🐳 **Backend:** Docker – run the ASP.NET Core API in a container
- 🌐 **Reverse Proxy:** Nginx – forward requests from the domain to the backend
- ☁️ **VPS:** Alibaba Cloud – deploy backend and Nginx on a server

---

Denno aims to provide a smooth and collaborative task management experience for teams of all sizes.
