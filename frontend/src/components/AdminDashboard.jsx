import React, { useState, useEffect } from 'react';

import axios from '../utils/axiosConfig';

import { Link, useNavigate } from 'react-router-dom';

import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import toast from 'react-hot-toast';



const PAGE_SIZE = 10;



function PaginationBar({ page, totalCount, onPageChange, isLoading }) {

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (totalCount <= PAGE_SIZE) return null;



  return (

    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">

      <button

        type="button"

        disabled={page <= 1 || isLoading}

        onClick={() => onPageChange(page - 1)}

        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"

      >

        Previous

      </button>

      <span className="text-sm text-gray-600">

        Page {page} of {pageCount} ({totalCount} total)

      </span>

      <button

        type="button"

        disabled={page >= pageCount || isLoading}

        onClick={() => onPageChange(page + 1)}

        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"

      >

        Next

      </button>

    </div>

  );

}



const AdminDashboard = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments');

  const [appointments, setAppointments] = useState([]);

  const [appointmentsPage, setAppointmentsPage] = useState(1);

  const [appointmentsTotal, setAppointmentsTotal] = useState(0);

  const [caseStudies, setCaseStudies] = useState([]);

  const [caseStudiesPage, setCaseStudiesPage] = useState(1);

  const [caseStudiesTotal, setCaseStudiesTotal] = useState(0);

  const [internshipApplications, setInternshipApplications] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');

  const [caseStudyForm, setCaseStudyForm] = useState({

    title: '',

    summary: '',

    full_content: '',

    court_name: '',

    image_url: '',

  });



  useEffect(() => {

    if (activeTab === 'appointments') fetchAppointments();

    else if (activeTab === 'case-studies') fetchCaseStudies();

    else if (activeTab === 'internship') fetchInternshipApplications();

  }, [activeTab, appointmentsPage, caseStudiesPage]);



  const fetchAppointments = async (page = appointmentsPage) => {

    setIsLoading(true);

    setError('');

    try {

      const response = await axios.get('/api/appointments', {

        params: { page, limit: PAGE_SIZE },

      });

      const { data, totalCount } = response.data;

      setAppointments(data || []);

      setAppointmentsTotal(totalCount ?? 0);

    } catch (err) {

      setError('Failed to fetch appointments');

    } finally {

      setIsLoading(false);

    }

  };



  const fetchCaseStudies = async (page = caseStudiesPage) => {

    setIsLoading(true);

    setError('');

    try {

      const response = await axios.get('/api/case-studies', {

        params: { page, limit: PAGE_SIZE },

      });

      const { data, totalCount } = response.data;

      setCaseStudies(data || []);

      setCaseStudiesTotal(totalCount ?? 0);

    } catch (err) {

      setError('Failed to fetch case studies');

    } finally {

      setIsLoading(false);

    }

  };



  const fetchInternshipApplications = async () => {

    setIsLoading(true);

    setError('');

    try {

      const response = await axios.get('/api/internship-applications');

      setInternshipApplications(response.data);

    } catch (err) {

      setError('Failed to fetch internship applications');

    } finally {

      setIsLoading(false);

    }

  };



  const handleCaseStudySubmit = async (e) => {

    e.preventDefault();

    setIsLoading(true);

    setError('');

    try {

      const payload = { ...caseStudyForm, image_url: caseStudyForm.image_url?.trim() || null };

      const response = await axios.post('/api/case-studies', payload);

      if (response.status === 201) {

        setCaseStudyForm({ title: '', summary: '', full_content: '', court_name: '', image_url: '' });

        setCaseStudiesPage(1);

        fetchCaseStudies(1);

        toast.success('Case study published.');

      }

    } catch (err) {

      const msg = err.response?.data?.error || 'Failed to publish case study';

      setError(msg);

      toast.error(msg);

    } finally {

      setIsLoading(false);

    }

  };



  const updateAppointmentStatus = async (id, status) => {

    try {

      await axios.put(`/api/appointments/${id}`, { status });

      fetchAppointments();

    } catch {

      setError('Failed to update appointment status');

    }

  };



  const handleLogout = () => {

    localStorage.removeItem('token');

    localStorage.removeItem('user');

    navigate('/login');

  };



  const handleDeleteCaseStudy = async (id) => {

    if (!window.confirm('Delete this case study?')) return;

    try {

      await axios.delete(`/api/case-studies/${id}`);

      const nextPage =

        caseStudies.length === 1 && caseStudiesPage > 1

          ? caseStudiesPage - 1

          : caseStudiesPage;

      if (nextPage !== caseStudiesPage) {

        setCaseStudiesPage(nextPage);

      } else {

        fetchCaseStudies(nextPage);

      }

    } catch {

      setError('Failed to delete case study');

    }

  };



  const formatDate = (dateString) =>

    new Date(dateString).toLocaleDateString('en-IN', {

      year: 'numeric',

      month: 'short',

      day: 'numeric',

      hour: '2-digit',

      minute: '2-digit',

    });



  const tabs = [

    { id: 'appointments', label: `Appointments (${appointmentsTotal})` },

    { id: 'case-studies', label: `Case Studies (${caseStudiesTotal})` },

    { id: 'internship', label: `Internship (${internshipApplications.length})` },

  ];



  return (

    <div className="min-h-screen bg-gray-100 pt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-wrap justify-between gap-4 items-center">

          <div>

            <h1 className="text-3xl font-bold text-navy">Admin Dashboard</h1>

            <p className="text-gray-600 mt-1">Manage appointments, case studies, and internships</p>

          </div>

          <div className="flex gap-3">

            <button type="button" onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg">

              Logout

            </button>

            <Link to="/" className="px-4 py-2 bg-navy text-white rounded-lg">

              Back to Website

            </Link>

          </div>

        </div>



        <div className="bg-white rounded-lg shadow-md mb-8 flex border-b overflow-x-auto">

          {tabs.map((tab) => (

            <button

              key={tab.id}

              type="button"

              onClick={() => setActiveTab(tab.id)}

              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${

                activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-gray-500'

              }`}

            >

              {tab.label}

            </button>

          ))}

        </div>



        {error && <p className="mb-4 text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}



        {activeTab === 'appointments' && (

          <div className="bg-white rounded-lg shadow-md p-6">

            <h2 className="text-xl font-semibold mb-4">Appointment Requests</h2>

            {isLoading ? (

              <p className="text-gray-500">Loading…</p>

            ) : appointments.length === 0 ? (

              <p className="text-gray-500">No appointments yet.</p>

            ) : (

              <>

                <div className="overflow-x-auto">

                  <table className="min-w-full text-sm">

                    <thead>

                      <tr className="border-b text-left text-gray-500">

                        <th className="py-2 pr-4">Name</th>

                        <th className="py-2 pr-4">Phone</th>

                        <th className="py-2 pr-4">Email</th>

                        <th className="py-2 pr-4">Status</th>

                        <th className="py-2">Date</th>

                      </tr>

                    </thead>

                    <tbody>

                      {appointments.map((a) => (

                        <tr key={a.id} className="border-b border-gray-100">

                          <td className="py-3 pr-4">{a.client_name}</td>

                          <td className="py-3 pr-4">{a.phone_number}</td>

                          <td className="py-3 pr-4">{a.email}</td>

                          <td className="py-3 pr-4">

                            <select

                              value={a.status || 'Pending'}

                              onChange={(e) => updateAppointmentStatus(a.id, e.target.value)}

                              className="border rounded px-2 py-1"

                            >

                              <option value="Pending">Pending</option>

                              <option value="Confirmed">Confirmed</option>

                              <option value="Completed">Completed</option>

                            </select>

                          </td>

                          <td className="py-3">{formatDate(a.created_at)}</td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                <PaginationBar

                  page={appointmentsPage}

                  totalCount={appointmentsTotal}

                  onPageChange={setAppointmentsPage}

                  isLoading={isLoading}

                />

              </>

            )}

          </div>

        )}



        {activeTab === 'case-studies' && (

          <div className="space-y-8">

            <div className="bg-white rounded-lg shadow-md p-6">

              <h2 className="text-xl font-semibold mb-4">Publish Case Study</h2>

              <form onSubmit={handleCaseStudySubmit} className="space-y-4">

                <input

                  className="w-full border rounded-lg px-3 py-2"

                  placeholder="Title"

                  value={caseStudyForm.title}

                  onChange={(e) => setCaseStudyForm({ ...caseStudyForm, title: e.target.value })}

                  required

                />

                <textarea

                  className="w-full border rounded-lg px-3 py-2"

                  placeholder="Summary"

                  rows={3}

                  value={caseStudyForm.summary}

                  onChange={(e) => setCaseStudyForm({ ...caseStudyForm, summary: e.target.value })}

                  required

                />

                <input

                  className="w-full border rounded-lg px-3 py-2"

                  placeholder="Court name"

                  value={caseStudyForm.court_name}

                  onChange={(e) => setCaseStudyForm({ ...caseStudyForm, court_name: e.target.value })}

                />

                <ReactQuill

                  theme="snow"

                  value={caseStudyForm.full_content}

                  onChange={(v) => setCaseStudyForm({ ...caseStudyForm, full_content: v })}

                />

                <button type="submit" disabled={isLoading} className="px-6 py-2 bg-navy text-white rounded-lg">

                  {isLoading ? 'Publishing…' : 'Publish'}

                </button>

              </form>

            </div>

            <div className="bg-white rounded-lg shadow-md p-6">

              <h2 className="text-xl font-semibold mb-4">Published Case Studies</h2>

              {isLoading ? (

                <p className="text-gray-500">Loading…</p>

              ) : caseStudies.length === 0 ? (

                <p className="text-gray-500">No case studies yet.</p>

              ) : (

                <>

                  <ul className="space-y-3">

                    {caseStudies.map((s) => (

                      <li key={s.id} className="flex justify-between items-center border-b pb-3">

                        <span className="font-medium">{s.title}</span>

                        <button type="button" onClick={() => handleDeleteCaseStudy(s.id)} className="text-red-600 text-sm">

                          Delete

                        </button>

                      </li>

                    ))}

                  </ul>

                  <PaginationBar

                    page={caseStudiesPage}

                    totalCount={caseStudiesTotal}

                    onPageChange={setCaseStudiesPage}

                    isLoading={isLoading}

                  />

                </>

              )}

            </div>

          </div>

        )}



        {activeTab === 'internship' && (

          <div className="bg-white rounded-lg shadow-md p-6">

            <h2 className="text-xl font-semibold mb-4">Internship Applications</h2>

            {isLoading ? (

              <p className="text-gray-500">Loading…</p>

            ) : internshipApplications.length === 0 ? (

              <p className="text-gray-500">No applications yet.</p>

            ) : (

              <ul className="space-y-3">

                {internshipApplications.map((app) => (

                  <li key={app.id} className="border rounded-lg p-4">

                    <p className="font-medium">{app.applicant_name || app.full_name}</p>

                    <p className="text-sm text-gray-600">{app.email} · {app.phone_number}</p>

                  </li>

                ))}

              </ul>

            )}

          </div>

        )}

      </div>

    </div>

  );

};



export default AdminDashboard;

