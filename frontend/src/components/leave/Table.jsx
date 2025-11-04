import React, { useMemo, useState } from 'react'

const Table = ({ leaves = [], onUpdateStatus }) => {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // all | pending | approved | rejected
  const [sortBy, setSortBy] = useState('applied') // applied | days | name
  const [sortDir, setSortDir] = useState('desc') // asc | desc

  const handleFilterClick = (status) => {
    setStatusFilter(status)
  }

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = leaves.filter((l) => {
      if (statusFilter !== 'all' && l.status !== statusFilter) return false
      if (!q) return true
      const empId = l.employeeMeta?.employeeId || ''
      const name = (l.employeeMeta?.employeeName || l.userId?.name || '').toLowerCase()
      const dept = (l.employeeMeta?.department || '')?.toLowerCase() || ''
      return empId.toLowerCase().includes(q) || name.includes(q) || dept.includes(q)
    })

    const withDays = list.map((l) => {
      const start = new Date(l.startDate)
      const end = new Date(l.endDate)
      const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
      return { ...l, __days: isNaN(days) ? 0 : days }
    })

    withDays.sort((a, b) => {
      if (sortBy === 'days') {
        return sortDir === 'asc' ? a.__days - b.__days : b.__days - a.__days
      }
      if (sortBy === 'name') {
        const an = (a.employeeMeta?.employeeName || a.userId?.name || '').toLowerCase()
        const bn = (b.employeeMeta?.employeeName || b.userId?.name || '').toLowerCase()
        if (an < bn) return sortDir === 'asc' ? -1 : 1
        if (an > bn) return sortDir === 'asc' ? 1 : -1
        return 0
      }
      // applied date
      const da = new Date(a.createdAt).getTime() || 0
      const db = new Date(b.createdAt).getTime() || 0
      return sortDir === 'asc' ? da - db : db - da
    })

    return withDays
  }, [leaves, query, statusFilter, sortBy, sortDir])

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by emp id, name or department"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-400 w-72"
          />

          <div className="flex items-center gap-2">
            <button onClick={() => handleFilterClick('all')} className={`px-3 py-1 rounded ${statusFilter === 'all' ? 'bg-indigo-600' : 'bg-gray-700'} text-white text-sm`}>
              All
            </button>
            <button onClick={() => handleFilterClick('pending')} className={`px-3 py-1 rounded ${statusFilter === 'pending' ? 'bg-yellow-600' : 'bg-gray-700'} text-white text-sm`}>
              Pending
            </button>
            <button onClick={() => handleFilterClick('approved')} className={`px-3 py-1 rounded ${statusFilter === 'approved' ? 'bg-green-600' : 'bg-gray-700'} text-white text-sm`}>
              Approved
            </button>
            <button onClick={() => handleFilterClick('rejected')} className={`px-3 py-1 rounded ${statusFilter === 'rejected' ? 'bg-red-600' : 'bg-gray-700'} text-white text-sm`}>
              Rejected
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-300 pr-2">Sort:</div>
          <button onClick={() => handleSortChange('applied')} className={`px-2 py-1 rounded ${sortBy === 'applied' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}>Applied Date</button>
          <button onClick={() => handleSortChange('days')} className={`px-2 py-1 rounded ${sortBy === 'days' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}>Days</button>
          <button onClick={() => handleSortChange('name')} className={`px-2 py-1 rounded ${sortBy === 'name' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}>Name</button>
        </div>
      </div>

      {/* Desktop / large screens: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-sm">SNo</th>
              <th className="px-4 py-2 text-left text-sm">Emp ID</th>
              <th className="px-4 py-2 text-left text-sm">Name</th>
              <th className="px-4 py-2 text-left text-sm">Leave Type</th>
              <th className="px-4 py-2 text-left text-sm">Department</th>
              <th className="px-4 py-2 text-left text-sm">Days</th>
              <th className="px-4 py-2 text-left text-sm">Status</th>
              <th className="px-4 py-2 text-left text-sm">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">No leaves found</td>
              </tr>
            )}

            {filtered.map((leave, idx) => (
              <tr key={leave._id} className="hover:bg-gray-800">
                <td className="px-4 py-3 align-top">{idx + 1}</td>
                <td className="px-4 py-3 align-top font-mono text-sm">{leave.employeeMeta?.employeeId || (leave.userId?._id)}</td>
                <td className="px-4 py-3 align-top">{leave.employeeMeta?.employeeName || leave.userId?.name}</td>
                <td className="px-4 py-3 align-top">{leave.leaveType}</td>
                <td className="px-4 py-3 align-top">{leave.employeeMeta?.department || '-'}</td>
                <td className="px-4 py-3 align-top">{leave.__days ?? ( (()=>{ const s=new Date(leave.startDate); const e=new Date(leave.endDate); const d=Math.round((e-s)/(1000*60*60*24))+1; return isNaN(d)?0:d })() )}</td>
                <td className="px-4 py-3 align-top">
                  <span className={`px-2 py-1 rounded text-sm ${leave.status === 'pending' ? 'bg-yellow-800 text-yellow-200' : leave.status === 'approved' ? 'bg-green-800 text-green-200' : 'bg-red-900 text-red-200'}`}>
                    {leave.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-top flex gap-2">
                  <button
                    onClick={() => onUpdateStatus && onUpdateStatus(leave._id, 'approved')}
                    disabled={leave.status === 'approved'}
                    className={`px-3 py-1 rounded text-sm ${leave.status === 'approved' ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}>
                    Approve
                  </button>
                  <button
                    onClick={() => onUpdateStatus && onUpdateStatus(leave._id, 'rejected')}
                    disabled={leave.status === 'rejected'}
                    className={`px-3 py-1 rounded text-sm ${leave.status === 'rejected' ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list */}
      <div className="block md:hidden space-y-3">
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-center text-gray-400">No leaves found</div>
        )}

        {filtered.map((leave, idx) => (
          <div key={leave._id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-gray-300">#{idx + 1} • <span className="font-mono">{leave.employeeMeta?.employeeId || (leave.userId?._id)}</span></div>
                <div className="text-lg font-semibold mt-1">{leave.employeeMeta?.employeeName || leave.userId?.name}</div>
                <div className="text-sm text-gray-400 mt-1">{leave.employeeMeta?.department || '-'}</div>
              </div>
              <div className="text-right">
                <div className={`px-2 py-1 rounded text-sm ${leave.status === 'pending' ? 'bg-yellow-800 text-yellow-200' : leave.status === 'approved' ? 'bg-green-800 text-green-200' : 'bg-red-900 text-red-200'}`}>
                  {leave.status}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-300">
              <div><span className="font-medium">Type:</span> {leave.leaveType}</div>
              <div><span className="font-medium">Dates:</span> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</div>
              <div><span className="font-medium">Days:</span> {leave.__days ?? ( (()=>{ const s=new Date(leave.startDate); const e=new Date(leave.endDate); const d=Math.round((e-s)/(1000*60*60*24))+1; return isNaN(d)?0:d })() )}</div>
              {leave.reason && <div className="mt-2 text-sm text-gray-400">{leave.reason}</div>}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onUpdateStatus && onUpdateStatus(leave._id, 'approved')}
                disabled={leave.status === 'approved'}
                className={`flex-1 px-3 py-2 rounded text-sm ${leave.status === 'approved' ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white'}`}>
                Approve
              </button>
              <button
                onClick={() => onUpdateStatus && onUpdateStatus(leave._id, 'rejected')}
                disabled={leave.status === 'rejected'}
                className={`flex-1 px-3 py-2 rounded text-sm ${leave.status === 'rejected' ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white'}`}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Table
