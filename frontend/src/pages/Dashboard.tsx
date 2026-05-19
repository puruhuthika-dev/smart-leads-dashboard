// frontend/src/pages/Dashboard.tsx

import {
  useEffect,
  useState,
  useMemo,
} from "react";

import debounce from "lodash/debounce";

import API from "../api/axios";

import type { Lead } from "../types/lead";

import { CSVLink } from "react-csv";

const Dashboard = () => {
  // ROLE

  const role =
    localStorage.getItem(
      "role"
    );

  // STATES

  const [leads, setLeads] =
    useState<Lead[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [sourceFilter, setSourceFilter] =
    useState("");

  const [editingId, setEditingId] =
    useState<string | null>(
      null
    );

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      company: "",
      status: "New",
      source: "Website",
    });

  // FETCH LEADS

  useEffect(() => {
    fetchLeads();
  }, [page]);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res =
        await API.get(
          `/leads?page=${page}`
        );

      setLeads(
        Array.isArray(
          res.data.leads
        )
          ? res.data.leads
          : []
      );

      setTotalPages(
        res.data.totalPages || 1
      );

      setLoading(false);
    } catch (err) {
      console.log(err);

      setError(
        "Failed to fetch leads"
      );

      setLoading(false);
    }
  };

  // SEARCH

  const debouncedSearch =
    useMemo(
      () =>
        debounce(
          (
            value: string
          ) => {
            setSearch(
              value
            );
          },
          500
        ),
      []
    );

  // HANDLE CHANGE

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // SUBMIT

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.company
    ) {
      alert(
        "Please fill all fields"
      );

      return;
    }

    try {
      if (editingId) {
        await API.put(
          `/leads/${editingId}`,
          formData
        );

        setEditingId(
          null
        );
      } else {
        await API.post(
          "/leads",
          formData
        );
      }

      fetchLeads();

      setFormData({
        name: "",
        email: "",
        company: "",
        status: "New",
        source: "Website",
      });
    } catch (err) {
      console.log(err);

      setError(
        "Something went wrong"
      );
    }
  };

  // EDIT

  const handleEdit = (
    lead: Lead
  ) => {
    setEditingId(
      lead._id!
    );

    setFormData({
      name: lead.name,
      email: lead.email,
      company:
        lead.company,
      status:
        lead.status,
      source:
        lead.source,
    });
  };

  // DELETE

  const handleDelete = async (
    id: string
  ) => {
    try {
      await API.delete(
        `/leads/${id}`
      );

      fetchLeads();
    } catch (err) {
      console.log(err);

      setError(
        "Delete failed"
      );
    }
  };

  // FILTERS

  const filteredLeads =
    Array.isArray(leads)
      ? leads.filter(
          (lead) => {
            const matchesSearch =
              lead.name
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||
              lead.email
                .toLowerCase()
                .includes(
                  search.toLowerCase()
                );

            const matchesStatus =
              statusFilter ===
                "" ||
              lead.status ===
                statusFilter;

            const matchesSource =
              sourceFilter ===
                "" ||
              lead.source ===
                sourceFilter;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesSource
            );
          }
        )
      : [];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}

      <div className="bg-black text-white p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold">
          GigFlow CRM
        </h1>

        <div className="flex gap-4">
          <CSVLink
            data={
              filteredLeads
            }
            filename="leads.csv"
            className="bg-green-500 px-4 py-2 rounded"
          >
            Export CSV
          </CSVLink>

          <button
            onClick={() => {
              localStorage.clear();

              window.location.href =
                "/";
            }}
            className="bg-red-500 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* ERROR */}

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="text-center text-2xl mb-4">
            Loading...
          </div>
        )}

        {/* STATS */}

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">
              Total Leads
            </h2>

            <p className="text-3xl font-bold">
              {leads.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">
              Qualified
            </h2>

            <p className="text-3xl font-bold">
              {
                leads.filter(
                  (lead) =>
                    lead.status ===
                    "Qualified"
                ).length
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">
              Contacted
            </h2>

            <p className="text-3xl font-bold">
              {
                leads.filter(
                  (lead) =>
                    lead.status ===
                    "Contacted"
                ).length
              }
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-gray-500">
              Lost
            </h2>

            <p className="text-3xl font-bold">
              {
                leads.filter(
                  (lead) =>
                    lead.status ===
                    "Lost"
                ).length
              }
            </p>
          </div>
        </div>

        {/* FORM */}

        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {editingId
              ? "Edit Lead"
              : "Add Lead"}
          </h2>

          <form
            onSubmit={
              handleSubmit
            }
            className="grid grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border p-3 rounded"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-3 rounded"
              value={
                formData.email
              }
              onChange={
                handleChange
              }
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              className="border p-3 rounded"
              value={
                formData.company
              }
              onChange={
                handleChange
              }
            />

            <select
              name="status"
              className="border p-3 rounded"
              value={
                formData.status
              }
              onChange={
                handleChange
              }
            >
              <option>
                New
              </option>

              <option>
                Contacted
              </option>

              <option>
                Qualified
              </option>

              <option>
                Lost
              </option>
            </select>

            <select
              name="source"
              className="border p-3 rounded"
              value={
                formData.source
              }
              onChange={
                handleChange
              }
            >
              <option>
                Website
              </option>

              <option>
                Instagram
              </option>

              <option>
                Referral
              </option>
            </select>

            <button
              type="submit"
              className="bg-black text-white p-3 rounded"
            >
              {editingId
                ? "Update Lead"
                : "Add Lead"}
            </button>
          </form>
        </div>

        {/* FILTERS */}

        <div className="bg-white p-6 rounded shadow mb-8 grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name/email"
            className="border p-3 rounded"
            value={
              searchTerm
            }
            onChange={(e) => {
              setSearchTerm(
                e.target.value
              );

              debouncedSearch(
                e.target.value
              );
            }}
          />

          <select
            className="border p-3 rounded"
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="">
              All Status
            </option>

            <option>
              New
            </option>

            <option>
              Contacted
            </option>

            <option>
              Qualified
            </option>

            <option>
              Lost
            </option>
          </select>

          <select
            className="border p-3 rounded"
            value={
              sourceFilter
            }
            onChange={(e) =>
              setSourceFilter(
                e.target.value
              )
            }
          >
            <option value="">
              All Sources
            </option>

            <option>
              Website
            </option>

            <option>
              Instagram
            </option>

            <option>
              Referral
            </option>
          </select>
        </div>

        {/* TABLE */}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4">
                  Name
                </th>

                <th className="p-4">
                  Email
                </th>

                <th className="p-4">
                  Company
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Source
                </th>

                <th className="p-4">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map(
                (lead) => (
                  <tr
                    key={
                      lead._id
                    }
                    className="border-b"
                  >
                    <td className="p-4">
                      {
                        lead.name
                      }
                    </td>

                    <td className="p-4">
                      {
                        lead.email
                      }
                    </td>

                    <td className="p-4">
                      {
                        lead.company
                      }
                    </td>

                    <td className="p-4">
                      {
                        lead.status
                      }
                    </td>

                    <td className="p-4">
                      {
                        lead.source
                      }
                    </td>

                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() =>
                          handleEdit(
                            lead
                          )
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      {role ===
                        "admin" && (
                        <button
                          onClick={() =>
                            handleDelete(
                              lead._id!
                            )
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}

        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
            className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Prev
          </button>

          <p className="text-lg">
            Page {page} of{" "}
            {totalPages}
          </p>

          <button
            disabled={
              page ===
              totalPages
            }
            onClick={() =>
              setPage(page + 1)
            }
            className="bg-black text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;