import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductImagesProps {
  images: string[];
  activeTab: string | null;
  setActiveTab: (val: string) => void;
}

export const ProductImages = ({
  images,
  activeTab,
  setActiveTab,
}: ProductImagesProps) => {
  return (
    <div className="left flex">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val)}
        orientation="vertical"
        className="w-24"
      >
        <TabsList className="flex flex-col gap-2 h-full justify-start">
          {images.map((img, idx) => (
            <TabsTrigger
              key={idx}
              value={img}
              className="w-[62px] h-[72px] p-0"
            >
              <img
                src={img}
                alt={`thumb-${idx}`}
                className="w-full h-full object-cover"
              />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex-1">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`${
              img === activeTab ? "block" : "hidden"
            } w-[500px] h-[600px]`}
          >
            <img src={img} alt={`product-${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
};
