import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Digital Menu - Buffr Host',
  description: 'Browse our restaurant menu and place orders',
};

export default function DigitalMenuPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">Restaurant Menu</h1>
        <p className="text-base-content/70 mt-2">
          Browse our digital menu and place your order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="tabs tabs-boxed mb-6">
            <a className="tab tab-active">Appetizers</a>
            <a className="tab">Main Courses</a>
            <a className="tab">Desserts</a>
            <a className="tab">Beverages</a>
            <a className="tab">Specials</a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-food.jpg" alt="Caesar Salad" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Caesar Salad</h2>
                <p>Fresh romaine lettuce with parmesan cheese, croutons, and our signature Caesar dressing</p>
                <div className="card-actions justify-between items-center">
                  <span className="text-2xl font-bold text-primary">N$ 45</span>
                  <button className="btn btn-primary">Add to Order</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-food.jpg" alt="Grilled Chicken" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Grilled Chicken Breast</h2>
                <p>Tender chicken breast marinated in herbs and spices, served with seasonal vegetables</p>
                <div className="card-actions justify-between items-center">
                  <span className="text-2xl font-bold text-primary">N$ 85</span>
                  <button className="btn btn-primary">Add to Order</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-food.jpg" alt="Ribeye Steak" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Ribeye Steak</h2>
                <p>Premium ribeye steak cooked to perfection, served with mashed potatoes and grilled asparagus</p>
                <div className="card-actions justify-between items-center">
                  <span className="text-2xl font-bold text-primary">N$ 120</span>
                  <button className="btn btn-primary">Add to Order</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-food.jpg" alt="Chocolate Cake" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Chocolate Lava Cake</h2>
                <p>Warm chocolate cake with a molten center, served with vanilla ice cream</p>
                <div className="card-actions justify-between items-center">
                  <span className="text-2xl font-bold text-primary">N$ 65</span>
                  <button className="btn btn-primary">Add to Order</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-food.jpg" alt="Fresh Juice" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Fresh Orange Juice</h2>
                <p>Freshly squeezed orange juice, served chilled</p>
                <div className="card-actions justify-between items-center">
                  <span className="text-2xl font-bold text-primary">N$ 25</span>
                  <button className="btn btn-primary">Add to Order</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image src="/placeholder-food.jpg" alt="Cappuccino" width={300} height={192} className="w-full h-48 object-cover" />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Cappuccino</h2>
                <p>Rich espresso with steamed milk and foam, perfect for any time of day</p>
                <div className="card-actions justify-between items-center">
                  <span className="text-2xl font-bold text-primary">N$ 35</span>
                  <button className="btn btn-primary">Add to Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Your Order</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Grilled Chicken Breast</span>
                  <span>N$ 85</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fresh Orange Juice</span>
                  <span>N$ 25</span>
                </div>
                <div className="divider"></div>
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>N$ 110</span>
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary w-full">Checkout</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Order Options</h2>
              <div className="space-y-3">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Dine In</span>
                    <input type="radio" name="order-type" className="radio radio-primary" checked />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Room Service</span>
                    <input type="radio" name="order-type" className="radio radio-primary" />
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Take Away</span>
                    <input type="radio" name="order-type" className="radio radio-primary" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Special Requests</h2>
              <textarea className="textarea textarea-bordered" placeholder="Any special dietary requirements or preferences?"></textarea>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Restaurant Hours</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Thursday:</span>
                  <span>7:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday - Saturday:</span>
                  <span>7:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>8:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
