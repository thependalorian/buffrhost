import { Metadata } from "next";
import { StatCard, PageHeader } from "@/src/components/ui";
import { Package, AlertTriangle, XCircle, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Inventory Management - Buffr Host",
  description: "Manage inventory, stock levels, and supplies",
};

export default function InventoryManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Inventory Management"
        description="Manage inventory, stock levels, and supplies across all departments"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Items"
          value="156"
          description="Inventory items"
          icon={<Package className="h-4 w-4" />}
          trend={{
            value: 5,
            label: "from last month",
            direction: "up"
          }}
          variant="default"
        />

        <StatCard
          title="Low Stock"
          value="12"
          description="Items need restocking"
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={{
            value: 2,
            label: "from last month",
            direction: "down"
          }}
          variant="warning"
        />

        <StatCard
          title="Out of Stock"
          value="3"
          description="Items unavailable"
          icon={<XCircle className="h-4 w-4" />}
          trend={{
            value: 1,
            label: "from last month",
            direction: "down"
          }}
          variant="error"
        />

        <StatCard
          title="Total Value"
          value="N$ 45,678"
          description="Inventory value"
          icon={<DollarSign className="h-4 w-4" />}
          trend={{
            value: 8,
            label: "from last month",
            direction: "up"
          }}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Inventory Items</h2>
                <div className="flex space-x-2">
                  <select className="select select-bordered select-sm">
                    <option>All Categories</option>
                    <option>Food & Beverage</option>
                    <option>Cleaning Supplies</option>
                    <option>Linen & Towels</option>
                    <option>Maintenance</option>
                    <option>Spa Products</option>
                    <option>Office Supplies</option>
                  </select>
                  <button className="btn btn-primary btn-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Item
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Min Level</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div>
                          <div className="font-bold">Chicken Breast</div>
                          <div className="text-sm opacity-50">Fresh meat</div>
                        </div>
                      </td>
                      <td>Food & Beverage</td>
                      <td>
                        <div className="font-bold">15 kg</div>
                      </td>
                      <td>10 kg</td>
                      <td>
                        <span className="badge badge-success">In Stock</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div>
                          <div className="font-bold">Bath Towels</div>
                          <div className="text-sm opacity-50">
                            White, 100% cotton
                          </div>
                        </div>
                      </td>
                      <td>Linen & Towels</td>
                      <td>
                        <div className="font-bold">45 pieces</div>
                      </td>
                      <td>50 pieces</td>
                      <td>
                        <span className="badge badge-warning">Low Stock</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div>
                          <div className="font-bold">All-Purpose Cleaner</div>
                          <div className="text-sm opacity-50">1L bottles</div>
                        </div>
                      </td>
                      <td>Cleaning Supplies</td>
                      <td>
                        <div className="font-bold">0 bottles</div>
                      </td>
                      <td>5 bottles</td>
                      <td>
                        <span className="badge badge-error">Out of Stock</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div>
                          <div className="font-bold">Light Bulbs</div>
                          <div className="text-sm opacity-50">
                            LED, 60W equivalent
                          </div>
                        </div>
                      </td>
                      <td>Maintenance</td>
                      <td>
                        <div className="font-bold">8 pieces</div>
                      </td>
                      <td>10 pieces</td>
                      <td>
                        <span className="badge badge-warning">Low Stock</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div>
                          <div className="font-bold">Essential Oils</div>
                          <div className="text-sm opacity-50">
                            Lavender, 50ml
                          </div>
                        </div>
                      </td>
                      <td>Spa Products</td>
                      <td>
                        <div className="font-bold">12 bottles</div>
                      </td>
                      <td>8 bottles</td>
                      <td>
                        <span className="badge badge-success">In Stock</span>
                      </td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-3">
                <button className="btn btn-outline w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Item
                </button>
                <button className="btn btn-outline w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                    />
                  </svg>
                  Stock Adjustment
                </button>
                <button className="btn btn-outline w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Purchase Orders
                </button>
                <button className="btn btn-outline w-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Categories</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Food & Beverage</span>
                  <span className="badge badge-primary">45 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cleaning Supplies</span>
                  <span className="badge badge-secondary">28 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Linen & Towels</span>
                  <span className="badge badge-accent">22 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maintenance</span>
                  <span className="badge badge-info">18 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Spa Products</span>
                  <span className="badge badge-warning">15 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Office Supplies</span>
                  <span className="badge badge-success">28 items</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Stock Alerts</h2>
              <div className="space-y-3">
                <div className="alert alert-error">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold">Out of Stock</h3>
                    <div className="text-xs">All-Purpose Cleaner</div>
                  </div>
                </div>
                <div className="alert alert-warning">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold">Low Stock</h3>
                    <div className="text-xs">Bath Towels, Light Bulbs</div>
                  </div>
                </div>
                <div className="alert alert-info">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-bold">Reorder Suggested</h3>
                    <div className="text-xs">5 items need reordering</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent Activity</h2>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-success">Stock Added</p>
                  <p className="text-base-content/70">Chicken Breast +10kg</p>
                  <p className="text-xs text-base-content/50">2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-warning">Low Stock Alert</p>
                  <p className="text-base-content/70">
                    Bath Towels below minimum
                  </p>
                  <p className="text-xs text-base-content/50">4 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-error">Out of Stock</p>
                  <p className="text-base-content/70">All-Purpose Cleaner</p>
                  <p className="text-xs text-base-content/50">6 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-info">Purchase Order</p>
                  <p className="text-base-content/70">Spa Products ordered</p>
                  <p className="text-xs text-base-content/50">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
