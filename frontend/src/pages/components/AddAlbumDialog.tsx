import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { axiosInstance } from '@/lib/axios';
import { Plus, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import toast from 'react-hot-toast';

const AddAlbumDialog = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newAlbum, setNewAlbum] = useState({
    title: '',
    artist: '',
    releaseYear: new Date().getFullYear(),
  });

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      return toast.error('Please fill in all fields');
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('title', newAlbum.title);
      formData.append('artist', newAlbum.artist);
      formData.append('releaseYear', newAlbum.releaseYear.toString());
      formData.append('imageFile', imageFile);

      await axiosInstance.post('/admin/albums', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNewAlbum({
        title: '',
        artist: '',
        releaseYear: new Date().getFullYear(),
      });
      setImageFile(null);
      setOpen(false);
      toast.success('Album added successfully');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-500 hover:bg-violet-600 text-white">
          <Plus className="mr-2 size-4" />
          Add Album
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle>Add New Album</DialogTitle>
          <DialogDescription>
            Add a new album to your collection
          </DialogDescription>
        </DialogHeader>

        {/* hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        <div className="space-y-4 py-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg"
          >
            <div className="text-center">
              <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                <Upload className="size-6 text-zinc-400" />
              </div>
              <div className="text-sm text-zinc-400 mb-2">
                {imageFile ? imageFile.name : 'Upload album artwork'}
              </div>
              <Button variant={'outline'} size={'sm'} className="text-xs">
                Choose File
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Album Title</label>
            <Input
              value={newAlbum.title}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, title: e.target.value })
              }
              placeholder="Enter album title"
            ></Input>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Artist</label>
            <Input
              value={newAlbum.artist}
              onChange={(e) =>
                setNewAlbum({ ...newAlbum, artist: e.target.value })
              }
              placeholder="Enter artist name"
            ></Input>
          </div>{' '}
          <div className="space-y-2">
            <label className="text-sm font-medium">Release Year</label>
            <Input
              value={newAlbum.releaseYear}
              onChange={(e) =>
                setNewAlbum({
                  ...newAlbum,
                  releaseYear: parseInt(e.target.value),
                })
              }
              placeholder="Enter release year"
              min={1900}
              max={new Date().getFullYear()}
            ></Input>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant={'outline'}
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading || !imageFile || !newAlbum.title || !newAlbum.artist
            }
          >
            {isLoading ? 'Creating' : 'Add Album'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAlbumDialog;
