import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface EditFieldDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    field: any;
    onSave: (updates: any) => Promise<void>;
}

const cropTypes = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Potato", "Tomato",
    "Onion", "Soybean", "Mustard", "Chickpea", "Pigeon Pea", "Barley",
    "Sorghum", "Millet", "Lentil", "Groundnut", "Sunflower", "Other"
];

const irrigationMethods = [
    "Drip Irrigation",
    "Sprinkler",
    "Flood/Basin",
    "Furrow",
    "Rainfed",
    "Other"
];

export const EditFieldDialog = ({ open, onOpenChange, field, onSave }: EditFieldDialogProps) => {
    const [name, setName] = useState(field?.name || "");
    const [cropType, setCropType] = useState(field?.cropType || "");
    const [variety, setVariety] = useState(field?.variety || "");
    const [sowingDate, setSowingDate] = useState(field?.sowingDate || "");
    const [expectedHarvestDate, setExpectedHarvestDate] = useState(field?.expectedHarvestDate || "");
    const [irrigationMethod, setIrrigationMethod] = useState(field?.irrigationMethod || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Field name is required");
            return;
        }
        if (!cropType) {
            toast.error("Crop type is required");
            return;
        }
        if (!sowingDate) {
            toast.error("Sowing date is required");
            return;
        }
        if (!irrigationMethod) {
            toast.error("Irrigation method is required");
            return;
        }

        setIsSaving(true);
        try {
            await onSave({
                name,
                cropType,
                variety,
                sowingDate,
                expectedHarvestDate, // Optional
                irrigationMethod
            });
            onOpenChange(false);
            toast.success("Field updated successfully");
        } catch (error) {
            console.error("Failed to update field:", error);
            toast.error("Failed to update field");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Field Details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Field Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="cropType">Crop Type</Label>
                        <Select value={cropType} onValueChange={setCropType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select crop" />
                            </SelectTrigger>
                            <SelectContent>
                                {cropTypes.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="variety">Variety (Optional)</Label>
                        <Input id="variety" value={variety} onChange={(e) => setVariety(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="sowingDate">Sowing Date</Label>
                        <Input
                            id="sowingDate"
                            type="date"
                            value={sowingDate}
                            onChange={(e) => setSowingDate(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="harvestDate">Expected Harvest Date (Optional)</Label>
                        <Input
                            id="harvestDate"
                            type="date"
                            value={expectedHarvestDate}
                            onChange={(e) => setExpectedHarvestDate(e.target.value)}
                            min={sowingDate}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="irrigation">Irrigation Method</Label>
                        <Select value={irrigationMethod} onValueChange={setIrrigationMethod}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                                {irrigationMethods.map((m) => (
                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
