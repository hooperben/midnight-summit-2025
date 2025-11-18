"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface CertificateFormData {
  clientId: string;
  issuedAt: string;
  duration: string;
}

export function CertificateForm() {
  const [formData, setFormData] = useState<CertificateFormData>({
    clientId: "",
    issuedAt: new Date().toISOString().split("T")[0],
    duration: "7days",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDurationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      duration: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Certificate Form Data:", formData);
  };

  const durationOptions = [
    { value: "1day", label: "1 Day" },
    { value: "3days", label: "3 Days" },
    { value: "7days", label: "7 Days" },
    { value: "14days", label: "14 Days" },
    { value: "30days", label: "30 Days" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Certificate Details</CardTitle>
        <CardDescription>
          Fill in the details to create a new medical certificate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client ID Field */}
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              name="clientId"
              placeholder="Enter client ID"
              value={formData.clientId}
              onChange={handleInputChange}
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              The unique identifier for the client receiving this certificate
            </p>
          </div>

          {/* Issued At Date */}
          <div className="space-y-2">
            <Label htmlFor="issuedAt" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Issued At
            </Label>
            <Input
              id="issuedAt"
              name="issuedAt"
              type="date"
              value={formData.issuedAt}
              onChange={handleInputChange}
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              The date when this certificate was issued
            </p>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <Label htmlFor="duration">Certificate Duration</Label>
            <Select
              value={formData.duration}
              onValueChange={handleDurationChange}
            >
              <SelectTrigger id="duration" className="w-full">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How long this certificate will remain valid
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" className="w-full" size="lg">
              Create Certificate
            </Button>
          </div>

          {/* Form Preview */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm font-semibold text-foreground mb-4">
              Form Data Preview
            </p>
            <pre className="bg-muted p-4 rounded-lg text-xs text-muted-foreground overflow-auto max-h-48">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
