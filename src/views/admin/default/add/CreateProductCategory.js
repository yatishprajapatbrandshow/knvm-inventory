import BaconBurger from "assets/img//product/Bacon Burger.jpg";

const Dashboard = () => {
  return (
    <div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <button
          className="bg-white flex gap-4 justify-center items-center p-5 rounded-xl shadow-sm cursor-pointer
          dark:!bg-navy-800 dark:text-white dark:shadow-none">
            <div>
              <p>Acoustic Bloc Screens</p>
              <p>Price: $ 295.00</p>
              <p>On hand: 16.00 Units</p>
            </div>
            <div>
              <img src={BaconBurger}/>
            </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
