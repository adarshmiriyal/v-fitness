"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, FileText, Plus, X, Edit, Trash2, CheckCircle, XCircle, Users, UserCheck, UserX, Clock } from "lucide-react"

interface Member {
  id: number
  first_name: string
  last_name: string
  email: string
  age: number
  phone_number: string
  is_active: boolean
  is_approved: boolean
  created_at: string
}

interface MemberRecord {
  id: number
  title: string
  description: string
  amount: number | string | null
  record_type: string
  created_at: string
  admin_name: string
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [records, setRecords] = useState<MemberRecord[]>([])
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [showAddRecord, setShowAddRecord] = useState(false)
  const [editingRecord, setEditingRecord] = useState<number | null>(null)
  const [recordForm, setRecordForm] = useState({
    title: "",
    description: "",
    amount: "",
    record_type: "payment",
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/admin/members")
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
        setError("")
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to load members")
      }
    } catch (error) {
      console.error("Failed to fetch members:", error)
      setError("Failed to load members. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: number) => {
    setActionLoading(id)
    setError("")
    setSuccess("")
    
    const member = members.find(m => m.id === id)
    const action = member?.is_active ? "block" : "unblock"
    
    try {
      const res = await fetch("/api/admin/members/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      })

      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, is_active: !m.is_active } : m,
          ),
        )
        setSuccess(`Member ${action}ed successfully`)
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.error || `Failed to ${action} member`)
      }
    } catch (err) {
      console.error("Failed to update status:", err)
      setError(`Failed to ${action} member. Please try again.`)
    } finally {
      setActionLoading(null)
    }
  }

  const fetchRecords = async (memberId: number) => {
    setRecordsLoading(true)
    try {
      const response = await fetch(`/api/admin/members/${memberId}/records`)
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      } else {
        setError("Failed to load records")
      }
    } catch (error) {
      console.error("Failed to fetch records:", error)
      setError("Failed to load records")
    } finally {
      setRecordsLoading(false)
    }
  }

  const handleViewRecords = (memberId: number) => {
    setSelectedMember(memberId)
    fetchRecords(memberId)
  }

  const handleAddRecord = async (memberId: number) => {
    if (!recordForm.title || !recordForm.description) {
      setError("Title and description are required")
      return
    }

    try {
      const response = await fetch(`/api/admin/members/${memberId}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recordForm.title,
          description: recordForm.description,
          amount: recordForm.amount ? parseFloat(recordForm.amount) : null,
          record_type: recordForm.record_type,
        }),
      })

      if (response.ok) {
        setSuccess("Record added successfully")
        setTimeout(() => setSuccess(""), 3000)
        setRecordForm({ title: "", description: "", amount: "", record_type: "payment" })
        setShowAddRecord(false)
        fetchRecords(memberId)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to add record")
      }
    } catch (error) {
      console.error("Failed to add record:", error)
      setError("Failed to add record. Please try again.")
    }
  }

  const handleEditRecord = (record: MemberRecord) => {
    setEditingRecord(record.id)
    setShowAddRecord(false)
    setRecordForm({
      title: record.title,
      description: record.description,
      amount: record.amount ? String(record.amount) : "",
      record_type: record.record_type,
    })
  }

  const handleUpdateRecord = async (memberId: number, recordId: number) => {
    if (!recordForm.title || !recordForm.description) {
      setError("Title and description are required")
      return
    }

    try {
      const response = await fetch(`/api/admin/members/records/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: recordForm.title,
          description: recordForm.description,
          amount: recordForm.amount ? parseFloat(recordForm.amount) : null,
          record_type: recordForm.record_type,
        }),
      })

      if (response.ok) {
        setSuccess("Record updated successfully")
        setTimeout(() => setSuccess(""), 3000)
        setRecordForm({ title: "", description: "", amount: "", record_type: "payment" })
        setEditingRecord(null)
        fetchRecords(memberId)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to update record")
      }
    } catch (error) {
      console.error("Failed to update record:", error)
      setError("Failed to update record. Please try again.")
    }
  }

  const handleDeleteRecord = async (memberId: number, recordId: number) => {
    if (!confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/members/records/${recordId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Record deleted successfully")
        setTimeout(() => setSuccess(""), 3000)
        fetchRecords(memberId)
      } else {
        const errorData = await response.json().catch(() => ({}))
        setError(errorData.error || "Failed to delete record")
      }
    } catch (error) {
      console.error("Failed to delete record:", error)
      setError("Failed to delete record. Please try again.")
    }
  }

  const cancelEdit = () => {
    setEditingRecord(null)
    setShowAddRecord(false)
    setRecordForm({ title: "", description: "", amount: "", record_type: "payment" })
  }

  const handleApproveMember = async (id: number, approve: boolean) => {
    setActionLoading(id)
    setError("")
    setSuccess("")
    
    try {
      const res = await fetch(`/api/admin/members/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approve }),
      })

      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, is_approved: approve } : m,
          ),
        )
        setSuccess(`Member ${approve ? "approved" : "rejected"} successfully`)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.error || `Failed to ${approve ? "approve" : "reject"} member`)
      }
    } catch (err) {
      console.error("Failed to update approval:", err)
      setError(`Failed to ${approve ? "approve" : "reject"} member. Please try again.`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteMember = async (id: number) => {
    const member = members.find(m => m.id === id)
    const memberName = member ? `${member.first_name} ${member.last_name}` : "this member"
    
    if (!confirm(`Are you sure you want to delete ${memberName}? This action cannot be undone and will permanently delete all associated records (attendance, records, etc.).`)) {
      return
    }

    setActionLoading(id)
    setError("")
    setSuccess("")
    
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id))
        setSuccess(`Member deleted successfully`)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        const errorData = await res.json().catch(() => ({}))
        setError(errorData.error || "Failed to delete member")
      }
    } catch (err) {
      console.error("Failed to delete member:", err)
      setError("Failed to delete member. Please try again.")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredMembers = members.filter((member) => {
    const searchLower = searchTerm.toLowerCase()
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase()
    const email = member.email.toLowerCase()
    return fullName.includes(searchLower) || email.includes(searchLower)
  })

  return (
    <div className="space-y-6">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[250px] flex items-center justify-center bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden" style={{ backgroundImage: 'url(/admin-members-hero.jpg)' }}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">User Management</h1>
          <p className="text-lg md:text-xl text-gray-100 drop-shadow-md">Manage all gym members</p>
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Summary Cards */}
      {!loading && members.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-2xl font-bold">{members.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-green-600" />
                <span className="text-2xl font-bold">
                  {members.filter(m => m.is_approved).length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-yellow-600" />
                <span className="text-2xl font-bold">
                  {members.filter(m => !m.is_approved).length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-indigo-600" />
                <span className="text-2xl font-bold">
                  {members.filter(m => m.is_active).length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
      <div className="grid gap-4">
          {filteredMembers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                {searchTerm ? (
                  <>
                    <p className="font-medium">No members found</p>
                    <p className="text-sm mt-1">Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">No members yet</p>
                    <p className="text-sm mt-1">Members will appear here once they sign up</p>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredMembers.map((member) => (
          <Card key={member.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-lg">
                    {member.first_name} {member.last_name}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span>Email: {member.email}</span>
                    <span>Age: {member.age}</span>
                    <span>Phone: {member.phone_number}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Joined:{" "}
                    {new Date(member.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Badge
                      variant={member.is_approved ? "default" : "secondary"}
                      className={member.is_approved ? "bg-green-600" : "bg-yellow-500"}
                    >
                      {member.is_approved ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                    <Badge
                      variant={member.is_active ? "default" : "destructive"}
                    >
                      {member.is_active ? "Active" : "Blocked"}
                    </Badge>
                  </div>

                  {!member.is_approved && (
                    <div className="flex gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={actionLoading === member.id}
                        onClick={() => handleApproveMember(member.id, true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoading === member.id}
                        onClick={() => handleApproveMember(member.id, false)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewRecords(member.id)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Records
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Records - {member.first_name} {member.last_name}
                          </DialogTitle>
                          <DialogDescription>
                            View and manage member records (payments, notes, etc.)
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">Member Records</h3>
                            <Button
                              size="sm"
                              onClick={() => {
                                setShowAddRecord(true)
                                setEditingRecord(null)
                                setRecordForm({ title: "", description: "", amount: "", record_type: "payment" })
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Record
                            </Button>
                          </div>

                          {(showAddRecord || editingRecord !== null) && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  {editingRecord !== null ? "Edit Record" : "Add New Record"}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="record_type">Record Type</Label>
                                  <select
                                    id="record_type"
                                    className="w-full p-2 border rounded-md"
                                    value={recordForm.record_type}
                                    onChange={(e) =>
                                      setRecordForm({ ...recordForm, record_type: e.target.value })
                                    }
                                  >
                                    <option value="payment">Payment</option>
                                    <option value="fee">Fee</option>
                                    <option value="note">Note</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="title">Title</Label>
                                  <Input
                                    id="title"
                                    placeholder="e.g., January Gym Fee"
                                    value={recordForm.title}
                                    onChange={(e) =>
                                      setRecordForm({ ...recordForm, title: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                    id="description"
                                    placeholder="Enter details..."
                                    rows={4}
                                    value={recordForm.description}
                                    onChange={(e) =>
                                      setRecordForm({ ...recordForm, description: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="amount">Amount (Optional)</Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={recordForm.amount}
                                    onChange={(e) =>
                                      setRecordForm({ ...recordForm, amount: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => 
                                      editingRecord !== null
                                        ? handleUpdateRecord(member.id, editingRecord)
                                        : handleAddRecord(member.id)
                                    }
                                    className="flex-1"
                                  >
                                    {editingRecord !== null ? "Update Record" : "Save Record"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={cancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {recordsLoading ? (
                            <div className="text-center py-4">Loading records...</div>
                          ) : records.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">
                              No records found. Add a record to get started.
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {records.map((record) => (
                                <Card key={record.id}>
                                  <CardContent className="pt-4">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-semibold">{record.title}</h4>
                                          <Badge variant="outline">{record.record_type}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                          {record.description}
                                        </p>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                          {record.amount !== null && (() => {
                                            const amountNumber =
                                              typeof record.amount === "number"
                                                ? record.amount
                                                : Number(record.amount)
                                            if (!Number.isNaN(amountNumber)) {
                                              return (
                                                <span>
                                                  Amount: ₹{amountNumber.toFixed(2)}
                                                </span>
                                              )
                                            }
                                            return null
                                          })()}
                                          <span>
                                            Added by: {record.admin_name}
                                          </span>
                                          <span>
                                            {new Date(record.created_at).toLocaleDateString("en-GB")}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 ml-4">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEditRecord(record)}
                                          disabled={editingRecord === record.id}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleDeleteRecord(member.id, record.id)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant={member.is_active ? "destructive" : "default"}
                      disabled={actionLoading === member.id}
                      onClick={() => toggleStatus(member.id)}
                    >
                      {member.is_active ? "Block" : "Unblock"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={actionLoading === member.id}
                      onClick={() => handleDeleteMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            ))
          )}
      </div>
      )}

      {/* Developer Credit */}
      <div className="text-center pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Developed by <span className="font-semibold text-gray-700">Adarshmiriyal</span>
        </p>
      </div>
    </div>
  )
}
