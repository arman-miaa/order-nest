
'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Power, PowerOff, Clock, Shield, ShieldOff } from "lucide-react";
import { StaffUser } from "@/src/types/user.type";

interface StaffTableProps {
  users: StaffUser[];
  onEdit: (user: StaffUser) => void;
  onDelete: (user: StaffUser) => void;
  onToggleStatus: (id: string) => void;
}

export function StaffTable({ users, onEdit, onDelete, onToggleStatus }: StaffTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>PIN</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No staff found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-50">
                  {/* Name & Email */}
                  <TableCell>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </TableCell>

                  {/* Role Badge */}
                  <TableCell>
                    <Badge variant={user.role === "kitchen" ? "default" : "secondary"}>
                      {user.role === "kitchen" ? "👨‍🍳 Kitchen" : "👤 Waiter"}
                    </Badge>
                  </TableCell>

                  {/* PIN */}
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{user.pin}</code>
                  </TableCell>

                  {/* Shift */}
                  <TableCell>
                    <span className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {user.shift === "morning" ? "Morning (8-4)" : "Evening (4-12)"}
                    </span>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Badge
                      className={`cursor-pointer ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700 hover:bg-green-200 border-green-300"
                          : "bg-red-100 text-red-700 hover:bg-red-200 border-red-300"
                      }`}
                      onClick={() => onToggleStatus(user._id)}
                    >
                      {user.status === "active" ? (
                        <><Shield className="h-3 w-3 mr-1" /> Active</>
                      ) : (
                        <><ShieldOff className="h-3 w-3 mr-1" /> Disabled</>
                      )}
                    </Badge>
                  </TableCell>

                  {/* Last Login */}
                  <TableCell className="text-sm text-gray-500">{user.lastLogin}</TableCell>

                  {/* Actions Dropdown */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* Edit action - opens respective modal based on role */}
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        {/* Toggle status */}
                        <DropdownMenuItem onClick={() => onToggleStatus(user._id)}>
                          {user.status === "active" ? (
                            <><PowerOff className="h-4 w-4 mr-2" /> Disable</>
                          ) : (
                            <><Power className="h-4 w-4 mr-2" /> Enable</>
                          )}
                        </DropdownMenuItem>
                        {/* Delete action */}
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDelete(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}