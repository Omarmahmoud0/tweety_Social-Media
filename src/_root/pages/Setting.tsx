import ChangePassword from "@/components/shared/ChangePassword";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Setting = () => {
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/settings.svg"
          width={36}
          height={36}
          alt="settings"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Settings</h2>
      </div>
      <div className="flex gap-9 w-full max-w-5xl">
        <Accordion
          type="single"
          collapsible
          className=" flex flex-col w-full gap-8 "
        >
          <AccordionItem value="item-2">
            <AccordionTrigger>Change Password</AccordionTrigger>
            <AccordionContent className="flex-center py-10">
              <ChangePassword />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Setting;
