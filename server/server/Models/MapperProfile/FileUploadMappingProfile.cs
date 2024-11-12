using AutoMapper;
using CloudinaryDotNet.Actions;
using server.Entities;

namespace server.Models.MapperProfile
{
    public class FileUploadMappingProfile: Profile
    {
        public FileUploadMappingProfile() 
        {
            CreateMap<ImageUploadResult, FileUpload>();
        }
    }
}
