const ProductInfo = () => {
  return (
    <div className="w-full flex flex-col gap-4 text-sm pt-4">
      <div className="flex flex-row gap-10">
        <p className="w-[120px] min-w-[120px]">Duties and Taxes</p>
        <p>You can check the Duties and Taxes in your shopping bag.</p>
      </div>
      <div className="flex flex-row gap-10 ">
        <p className="w-[120px] min-w-[120px]">Estimated Delivery</p>
        <p>
          Ships in an average of 6 days.
          <span className="block mt-1 text-gray-500">
            ※ within 3-9 days, excluding weekends/holidays
          </span>
        </p>
      </div>
      <div className="flex flex-row gap-10">
        <p className="w-[120px] min-w-[120px]">Delivery</p>
        <p>
          $8.50<span>Free shipping on orders above $50</span>
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;
