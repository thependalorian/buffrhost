import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Menu Management - Buffr Host',
  description: 'Manage restaurant menus, items, and pricing',
};

export default function MenuManagementPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Menu Management</h1>
        <p className="text-base-content/70 mt-2">
          Manage restaurant menus, items, pricing, and availability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Items</div>
            <div className="stat-value text-primary">45</div>
            <div className="stat-desc">Menu items</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Categories</div>
            <div className="stat-value text-secondary">8</div>
            <div className="stat-desc">Menu categories</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Available</div>
            <div className="stat-value text-success">42</div>
            <div className="stat-desc">In stock</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Out of Stock</div>
            <div className="stat-value text-error">3</div>
            <div className="stat-desc">Unavailable</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">Menu Items</h2>
                <div className="flex space-x-2">
                  <select className="select select-bordered select-sm">
                    <option>All Categories</option>
                    <option>Appetizers</option>
                    <option>Main Courses</option>
                    <option>Desserts</option>
                    <option>Beverages</option>
                  </select>
                  <button className="btn btn-primary btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-food.jpg" alt="Grilled Chicken" width={60} height={60} className="rounded" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Grilled Chicken Breast</div>
                            <div className="text-sm opacity-50">Tender chicken with herbs</div>
                          </div>
                        </div>
                      </td>
                      <td>Main Course</td>
                      <td>N$ 85</td>
                      <td><span className="badge badge-success">Available</span></td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-food.jpg" alt="Caesar Salad" width={60} height={60} className="rounded" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Caesar Salad</div>
                            <div className="text-sm opacity-50">Fresh romaine with dressing</div>
                          </div>
                        </div>
                      </td>
                      <td>Appetizer</td>
                      <td>N$ 45</td>
                      <td><span className="badge badge-success">Available</span></td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-food.jpg" alt="Chocolate Cake" width={60} height={60} className="rounded" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Chocolate Lava Cake</div>
                            <div className="text-sm opacity-50">Warm chocolate with ice cream</div>
                          </div>
                        </div>
                      </td>
                      <td>Dessert</td>
                      <td>N$ 65</td>
                      <td><span className="badge badge-error">Out of Stock</span></td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-food.jpg" alt="Fresh Juice" width={60} height={60} className="rounded" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Fresh Orange Juice</div>
                            <div className="text-sm opacity-50">Freshly squeezed</div>
                          </div>
                        </div>
                      </td>
                      <td>Beverage</td>
                      <td>N$ 25</td>
                      <td><span className="badge badge-success">Available</span></td>
                      <td>
                        <button className="btn btn-ghost btn-xs">Edit</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12">
                              <Image src="/placeholder-food.jpg" alt="Beef Steak" width={60} height={60} className="rounded" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">Ribeye Steak</div>
                            <div className="text-sm opacity-50">Premium cut with sides</div>
                          </div>
                        </div>
                      </td>
                      <td>Main Course</td>
                      <td>N$ 120</td>
                      <td><span className="badge badge-warning">Limited</span></td>
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Item
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Manage Categories
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Menu Analytics
                </button>
                <button className="btn btn-outline w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Menu
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Menu Categories</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Appetizers</span>
                  <span className="badge badge-primary">8 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Main Courses</span>
                  <span className="badge badge-secondary">15 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Desserts</span>
                  <span className="badge badge-accent">6 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Beverages</span>
                  <span className="badge badge-info">12 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Specials</span>
                  <span className="badge badge-warning">4 items</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Popular Items</h2>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">Grilled Chicken Breast</p>
                  <p className="text-base-content/70">23 orders today</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Caesar Salad</p>
                  <p className="text-base-content/70">18 orders today</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Fresh Orange Juice</p>
                  <p className="text-base-content/70">15 orders today</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Ribeye Steak</p>
                  <p className="text-base-content/70">12 orders today</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Inventory Alerts</h2>
              <div className="space-y-3">
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Chocolate Lava Cake - Out of stock</span>
                </div>
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Ribeye Steak - Low stock (3 left)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
