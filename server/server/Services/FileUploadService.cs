using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using server.Entities;
using server.Infrastructure.Configurations;
using server.Infrastructure.Providers;
using server.Interfaces;
using server.Models;
using System.Net;

namespace server.Services
{
    public class FileUploadService: IFileUploadService
    {
        private readonly IMapper _mapper;
        private readonly ILogger<FileUploadService> _logger;
        private Cloudinary _cloudinary { get; }
        private readonly CloudinarySettings _config;

        public FileUploadService(
            ILogger<FileUploadService> logger,
            IMapper mapper,
            IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _logger = logger;
            _mapper = mapper;
            _config = cloudinaryConfig.Value;
            _cloudinary = new Cloudinary(new Account(
                _config.CloudName,
                _config.ApiKey,
                _config.ApiSecret));
        }

        public async Task<FileUploadResult> UploadPhotoAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return new FileUploadResult
                {
                    Success = false,
                    ErrorMessage = "File cannot be null or empty"
                };
            }

            using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(file.FileName, stream),
                Folder = CloudinaryProvider.folder,
                Transformation = new Transformation()
                                    .Width(100)
                                    .Quality("auto")
                                    .FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == HttpStatusCode.OK)
            {
                return new FileUploadResult 
                { 
                    Success = true,
                    FileUpload = _mapper.Map<FileUpload>(uploadResult),
                    Url = uploadResult.Url.ToString()
                };
            }
            else
            {
                return new FileUploadResult
                {
                    Success = false,
                    ErrorMessage = uploadResult.Error.Message
                };
            }
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publicId)
        {
            var deletionParams = new DeletionParams(publicId);
            var deletionResult = await _cloudinary.DestroyAsync(deletionParams);

            return deletionResult;
        }
    }
}
