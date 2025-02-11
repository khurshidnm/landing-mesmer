"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface Constant {
  id: string;
  type: "email" | "phone" | "link";
  value: string;
  label?: string;
}

const mockConstants: Constant[] = [
  {
    id: "1",
    type: "email",
    value: "contact@example.com",
    label: "Contact Email",
  },
  { id: "2", type: "phone", value: "+1234567890", label: "Main Phone" },
  { id: "3", type: "link", value: "https://example.com", label: "Website" },
];

const ConstantsManagement = () => {
  const [constants, setConstants] = useState<Constant[]>(mockConstants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentConstant, setCurrentConstant] = useState<Constant | null>(null);

  const handleOpenModal = (constant: Constant) => {
    setCurrentConstant(constant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setCurrentConstant(null);
    setIsModalOpen(false);
  };

  const handleSaveConstant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedConstant: Constant = {
      ...currentConstant!,
      type: formData.get("type") as Constant["type"],
      value: formData.get("value") as string,
      label: formData.get("label") as string,
    };

    // Update the constant in the mock data
    setConstants((prev) =>
      prev.map((c) => (c.id === updatedConstant.id ? updatedConstant : c))
    );
    handleCloseModal();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Constants Management
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {constants.map((constant, index) => (
          <motion.div
            key={constant.id}
            className="bg-white p-4 rounded-lg shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-2">
              {constant.label || constant.type}
            </h2>
            <p className="text-gray-600 mb-4">{constant.value}</p>
            <Button variant="outline" onClick={() => handleOpenModal(constant)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && currentConstant && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Constant</DialogTitle>
                <DialogDescription>
                  Update the details of the constant.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveConstant}>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      defaultValue={currentConstant.type}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="link">Link</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="label"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Label
                    </label>
                    <Input
                      type="text"
                      id="label"
                      name="label"
                      defaultValue={currentConstant.label || ""}
                      placeholder="Enter a label"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="value"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Value
                    </label>
                    <Input
                      type="text"
                      id="value"
                      name="value"
                      defaultValue={currentConstant.value}
                      placeholder="Enter the value"
                      required
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConstantsManagement;
