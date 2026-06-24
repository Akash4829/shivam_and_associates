import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  appointmentsService,
  caseStudiesService,
  internshipService,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const PAGE_SIZE = 10;
const INTERNSHIP_PAGE_SIZE = 15;
const APPOINTMENT_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const INTERNSHIP_STATUSES = ['Pending', 'Shortlisted', 'Approved', 'Rejected'];

const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Shortlisted: 'bg-blue-100 text-blue-800 border-blue-200',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
  Confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Completed: 'bg-slate-100 text-slate-700 border-slate-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
};

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {status || 'Pending'}
    </span>
  );
}

function StatCard({ label, value, hint, accent = 'slate' }) {
  const accents = {
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    red: 'border-red-200 bg-red-50 text-red-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-700',
  };
  return (
    <div className={`rounded-xl border p-5 ${accents[accent] || accents.slate}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

function PaginationBar({ page, totalCount, pageSize, onPageChange, isLoading }) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  if (totalCount <= pageSize) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
      <button
        type="button"
        disabled={page <= 1 || isLoading}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
      >
        Previous
      </button>
      <span className="text-sm text-slate-600">
        Page {page} of {pageCount} ({totalCount} total)
      </span>
      <button
        type="button"
        disabled={page >= pageCount || isLoading}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
      >
        Next
      </button>
    </div>
  );
}

function InternshipDetailModal({ application, onClose, onSave, saving }) {
  const [status, setStatus] = useState(application?.status || 'Pending');
  const [adminNotes, setAdminNotes] = useState(application?.admin_notes || '');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setStatus(application?.status || 'Pending');
    setAdminNotes(application?.admin_notes || '');
  }, [application]);

  if (!application) return null;

  const handleDownload = async () => {
    if (!application.resume_path) return;
    setDownloading(true);
    try {
      await internshipService.downloadResume(
        application.resume_path,
        application.resume_filename || application.resume_path
      );
      toast.success('Resume downloaded');
    } catch {
      toast.error('Failed to download resume');
    } finally {
      setDownloading(false);
    }
  };

  const handleQuickAction = (nextStatus) => {
    setStatus(nextStatus);
    onSave(application.id, { status: nextStatus, admin_notes: adminNotes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="internship-modal-title"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Application review</p>
            <h2 id="internship-modal-title" className="text-xl font-bold text-slate-900 mt-1">
              {application.applicant_name}
            </h2>
            <div className="mt-2">
              <StatusBadge status={application.status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Email</p>
              <p className="mt-1 text-slate-900">{application.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Phone</p>
              <p className="mt-1 text-slate-900">{application.phone_number}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">College</p>
              <p className="mt-1 text-slate-900">{application.college_university || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Year / Semester</p>
              <p className="mt-1 text-slate-900">{application.current_year_semester || '—'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-slate-500">Areas of interest</p>
            <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap">
              {application.areas_of_interest || '—'}
            </p>
          </div>

          {application.cover_letter && (
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Cover letter</p>
              <p className="mt-1 text-sm text-slate-800 whitespace-pre-wrap rounded-lg bg-slate-50 border border-slate-200 p-4">
                {application.cover_letter}
              </p>
            </div>
          )}

          {application.resume_path && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
            >
              {downloading ? 'Downloading…' : `Download resume (${application.resume_filename || 'file'})`}
            </button>
          )}

          <div className="border-t border-slate-200 pt-5 space-y-4">
            <p className="text-sm font-semibold text-slate-900">Admin decision</p>
            <div className="flex flex-wrap gap-2">
              {['Shortlisted', 'Approved', 'Rejected'].map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={saving}
                  onClick={() => handleQuickAction(s)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    status === s
                      ? STATUS_STYLES[s]
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="internship-status" className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                Status
              </label>
              <select
                id="internship-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white"
              >
                {INTERNSHIP_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="admin-notes" className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">
                Internal notes (not sent to applicant)
              </label>
              <textarea
                id="admin-notes"
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Interview notes, follow-up reminders, etc."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>

            {application.reviewed_at && (
              <p className="text-xs text-slate-500">
                Last reviewed {formatDate(application.reviewed_at)}
                {application.reviewed_by_name ? ` by ${application.reviewed_by_name}` : ''}
              </p>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-white"
          >
            Close
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(application.id, { status, admin_notes: adminNotes })}
            className="px-5 py-2 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save decision'}
          </button>
        </div>
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsPage, setAppointmentsPage] = useState(1);
  const [appointmentsTotal, setAppointmentsTotal] = useState(0);

  const [caseStudies, setCaseStudies] = useState([]);
  const [caseStudiesPage, setCaseStudiesPage] = useState(1);
  const [caseStudiesTotal, setCaseStudiesTotal] = useState(0);

  const [internshipApplications, setInternshipApplications] = useState([]);
  const [internshipPage, setInternshipPage] = useState(1);
  const [internshipTotal, setInternshipTotal] = useState(0);
  const [internshipFilter, setInternshipFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [savingApplication, setSavingApplication] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [caseStudyForm, setCaseStudyForm] = useState({
    title: '',
    summary: '',
    full_content: '',
    court_name: '',
    image_url: '',
  });

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await internshipService.getStats();
      setStats(response.data);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchAppointments = useCallback(
    async (page = appointmentsPage) => {
      setIsLoading(true);
      setError('');
      try {
        const response = await appointmentsService.list({ page, limit: PAGE_SIZE });
        const { data, totalCount } = response.data;
        setAppointments(Array.isArray(data) ? data : []);
        setAppointmentsTotal(typeof totalCount === 'number' ? totalCount : 0);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to fetch appointments');
      } finally {
        setIsLoading(false);
      }
    },
    [appointmentsPage]
  );

  const fetchCaseStudies = useCallback(
    async (page = caseStudiesPage) => {
      setIsLoading(true);
      setError('');
      try {
        const response = await caseStudiesService.list({ page, limit: PAGE_SIZE });
        const body = response.data;
        if (Array.isArray(body)) {
          setCaseStudies(body);
          setCaseStudiesTotal(body.length);
        } else {
          setCaseStudies(Array.isArray(body.data) ? body.data : []);
          setCaseStudiesTotal(typeof body.totalCount === 'number' ? body.totalCount : 0);
        }
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to fetch case studies');
      } finally {
        setIsLoading(false);
      }
    },
    [caseStudiesPage]
  );

  const fetchInternshipApplications = useCallback(
    async (page = internshipPage, status = internshipFilter) => {
      setIsLoading(true);
      setError('');
      try {
        const response = await internshipService.list({
          page,
          limit: INTERNSHIP_PAGE_SIZE,
          status: status || undefined,
        });
        const { data, totalCount } = response.data;
        setInternshipApplications(Array.isArray(data) ? data : []);
        setInternshipTotal(typeof totalCount === 'number' ? totalCount : 0);
      } catch (err) {
        setError(err?.response?.data?.error || 'Failed to fetch internship applications');
      } finally {
        setIsLoading(false);
      }
    },
    [internshipPage, internshipFilter]
  );

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'overview') fetchStats();
    else if (activeTab === 'appointments') fetchAppointments(appointmentsPage);
    else if (activeTab === 'case-studies') fetchCaseStudies(caseStudiesPage);
    else if (activeTab === 'internship') fetchInternshipApplications(internshipPage, internshipFilter);
  }, [
    activeTab,
    appointmentsPage,
    caseStudiesPage,
    internshipPage,
    internshipFilter,
    fetchStats,
    fetchAppointments,
    fetchCaseStudies,
    fetchInternshipApplications,
  ]);

  const handleCaseStudySubmit = async (e) => {
    e.preventDefault();
    if (!caseStudyForm.title.trim() || !caseStudyForm.summary.trim() || !caseStudyForm.full_content.trim() || !caseStudyForm.court_name.trim()) {
      toast.error('Title, summary, content and court are required');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const payload = {
        ...caseStudyForm,
        image_url: caseStudyForm.image_url?.trim() || null,
      };
      const response = await caseStudiesService.create(payload);
      if (response.status === 201 || response.status === 200) {
        setCaseStudyForm({ title: '', summary: '', full_content: '', court_name: '', image_url: '' });
        setCaseStudiesPage(1);
        fetchCaseStudies(1);
        fetchStats();
        toast.success('Case study published');
      }
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to publish case study';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await appointmentsService.updateStatus(id, status);
      fetchAppointments(appointmentsPage);
      fetchStats();
      toast.success('Status updated');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to update status';
      setError(msg);
      toast.error(msg);
    }
  };

  const updateInternshipApplication = async (id, payload) => {
    setSavingApplication(true);
    try {
      const response = await internshipService.update(id, payload);
      const updated = response.data.application;
      setInternshipApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, ...updated } : app))
      );
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => ({ ...prev, ...updated }));
      }
      fetchStats();
      toast.success('Application updated');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to update application';
      toast.error(msg);
    } finally {
      setSavingApplication(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteCaseStudy = async (id) => {
    if (!window.confirm('Delete this case study?')) return;
    try {
      await caseStudiesService.remove(id);
      const nextPage = caseStudies.length === 1 && caseStudiesPage > 1 ? caseStudiesPage - 1 : caseStudiesPage;
      if (nextPage !== caseStudiesPage) setCaseStudiesPage(nextPage);
      else fetchCaseStudies(nextPage);
      fetchStats();
      toast.success('Case study deleted');
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to delete case study');
    }
  };

  const internshipStats = stats?.internships || {};
  const appointmentStats = stats?.appointments || {};

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'internship', label: `Internships (${internshipStats.pending ?? 0} pending)` },
    { id: 'appointments', label: `Appointments (${appointmentStats.pending ?? 0} pending)` },
    { id: 'case-studies', label: `Case Studies (${stats?.caseStudies ?? 0})` },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <Helmet>
        <title>Admin Dashboard</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-wrap justify-between gap-4 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Firm administration</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Admin Dashboard</h1>
            <p className="text-slate-600 mt-1 text-sm">
              Signed in as <span className="font-medium">{user?.email || 'admin'}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Back to Website
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm mb-6 flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg text-sm">{error}</div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {statsLoading ? (
              <p className="text-slate-500 text-sm">Loading overview…</p>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard label="Pending internships" value={internshipStats.pending ?? 0} accent="amber" hint="Awaiting review" />
                  <StatCard label="Shortlisted" value={internshipStats.shortlisted ?? 0} accent="blue" />
                  <StatCard label="Approved" value={internshipStats.approved ?? 0} accent="emerald" />
                  <StatCard label="Pending appointments" value={appointmentStats.pending ?? 0} accent="slate" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-slate-900">Recent internship applications</h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('internship')}
                        className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                      >
                        View all →
                      </button>
                    </div>
                    {(stats?.recentApplications || []).length === 0 ? (
                      <p className="text-sm text-slate-500">No applications yet.</p>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {stats.recentApplications.map((app) => (
                          <li key={app.id} className="py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 truncate">{app.applicant_name}</p>
                              <p className="text-xs text-slate-500">{formatDate(app.created_at)}</p>
                            </div>
                            <StatusBadge status={app.status} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-slate-900">Recent appointment requests</h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('appointments')}
                        className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                      >
                        View all →
                      </button>
                    </div>
                    {(stats?.recentAppointments || []).length === 0 ? (
                      <p className="text-sm text-slate-500">No appointments yet.</p>
                    ) : (
                      <ul className="divide-y divide-slate-100">
                        {stats.recentAppointments.map((a) => (
                          <li key={a.id} className="py-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 truncate">{a.client_name}</p>
                              <p className="text-xs text-slate-500">{formatDate(a.created_at)}</p>
                            </div>
                            <StatusBadge status={a.status} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">Quick actions</h2>
                  <p className="text-sm text-slate-600 mb-4">
                    {internshipStats.new_this_week ?? 0} new internship application(s) this week.
                    Review pending applications and update their status to notify applicants by email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('internship')}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500 text-white hover:bg-amber-600"
                  >
                    Review internship applications
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Appointment Requests</h2>
            {isLoading ? (
              <p className="text-slate-500 text-sm">Loading…</p>
            ) : appointments.length === 0 ? (
              <p className="text-slate-500 text-sm">No appointments yet.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="py-2 pr-4 font-medium">Name</th>
                        <th className="py-2 pr-4 font-medium">Phone</th>
                        <th className="py-2 pr-4 font-medium">Email</th>
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a) => (
                        <tr key={a.id} className="border-b border-slate-100">
                          <td className="py-3 pr-4 text-slate-900">{a.client_name}</td>
                          <td className="py-3 pr-4 text-slate-700">{a.phone_number}</td>
                          <td className="py-3 pr-4 text-slate-700">{a.email}</td>
                          <td className="py-3 pr-4">
                            <select
                              value={a.status || 'Pending'}
                              onChange={(e) => updateAppointmentStatus(a.id, e.target.value)}
                              className="border border-slate-200 rounded px-2 py-1 text-sm bg-white"
                            >
                              {APPOINTMENT_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 text-slate-600">{formatDate(a.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationBar
                  page={appointmentsPage}
                  totalCount={appointmentsTotal}
                  pageSize={PAGE_SIZE}
                  onPageChange={setAppointmentsPage}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'case-studies' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Publish Case Study</h2>
              <form onSubmit={handleCaseStudySubmit} className="space-y-4">
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Title"
                  value={caseStudyForm.title}
                  onChange={(e) => setCaseStudyForm({ ...caseStudyForm, title: e.target.value })}
                  required
                />
                <textarea
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Summary"
                  rows={3}
                  value={caseStudyForm.summary}
                  onChange={(e) => setCaseStudyForm({ ...caseStudyForm, summary: e.target.value })}
                  required
                />
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Court name"
                  value={caseStudyForm.court_name}
                  onChange={(e) => setCaseStudyForm({ ...caseStudyForm, court_name: e.target.value })}
                  required
                />
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Image URL (optional)"
                  value={caseStudyForm.image_url}
                  onChange={(e) => setCaseStudyForm({ ...caseStudyForm, image_url: e.target.value })}
                />
                <ReactQuill
                  theme="snow"
                  value={caseStudyForm.full_content}
                  onChange={(v) => setCaseStudyForm({ ...caseStudyForm, full_content: v })}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                  {isLoading ? 'Publishing…' : 'Publish'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Published Case Studies</h2>
              {isLoading && caseStudies.length === 0 ? (
                <p className="text-slate-500 text-sm">Loading…</p>
              ) : caseStudies.length === 0 ? (
                <p className="text-slate-500 text-sm">No case studies yet.</p>
              ) : (
                <>
                  <ul className="divide-y divide-slate-100">
                    {caseStudies.map((s) => (
                      <li key={s.id} className="flex justify-between items-center py-3">
                        <div>
                          <p className="font-medium text-slate-900">{s.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{s.court_name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCaseStudy(s.id)}
                          className="text-red-600 text-sm hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                  <PaginationBar
                    page={caseStudiesPage}
                    totalCount={caseStudiesTotal}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCaseStudiesPage}
                    isLoading={isLoading}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'internship' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Internship Applications</h2>
                <p className="text-sm text-slate-600 mt-1">
                  Review resumes, shortlist candidates, and approve or reject applications. Applicants are notified by email when status changes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {['', ...INTERNSHIP_STATUSES].map((filter) => {
                const label = filter || 'All';
                const active = internshipFilter === filter;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setInternshipFilter(filter);
                      setInternshipPage(1);
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      active
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {isLoading ? (
              <p className="text-slate-500 text-sm">Loading…</p>
            ) : internshipApplications.length === 0 ? (
              <p className="text-slate-500 text-sm">No applications in this category.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-slate-500">
                        <th className="py-2 pr-4 font-medium">Applicant</th>
                        <th className="py-2 pr-4 font-medium">College</th>
                        <th className="py-2 pr-4 font-medium">Interest</th>
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 pr-4 font-medium">Submitted</th>
                        <th className="py-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {internshipApplications.map((app) => (
                        <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                          <td className="py-3 pr-4">
                            <p className="font-medium text-slate-900">{app.applicant_name}</p>
                            <p className="text-xs text-slate-500">{app.email}</p>
                          </td>
                          <td className="py-3 pr-4 text-slate-700">
                            <p>{app.college_university || '—'}</p>
                            <p className="text-xs text-slate-500">{app.current_year_semester}</p>
                          </td>
                          <td className="py-3 pr-4 text-slate-700 max-w-[200px] truncate">
                            {app.areas_of_interest || '—'}
                          </td>
                          <td className="py-3 pr-4">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">
                            {formatDate(app.created_at)}
                          </td>
                          <td className="py-3">
                            <button
                              type="button"
                              onClick={() => setSelectedApplication(app)}
                              className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <PaginationBar
                  page={internshipPage}
                  totalCount={internshipTotal}
                  pageSize={INTERNSHIP_PAGE_SIZE}
                  onPageChange={setInternshipPage}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        )}
      </div>

      {selectedApplication && (
        <InternshipDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onSave={updateInternshipApplication}
          saving={savingApplication}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
