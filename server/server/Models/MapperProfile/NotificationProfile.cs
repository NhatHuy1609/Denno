using AutoMapper;
using server.Dtos.Response.Notification;
using server.Entities;
using server.Enums;

namespace server.Models.MapperProfile
{
    public class NotificationProfile: Profile
    {
        public NotificationProfile()
        {
            //CreateMap<Notification, NotificationResponseDto>()
            //    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id.ToString()))
            //    .ForMember(dest => dest.Type, opt => opt.MapFrom(src => (ActionType)src.Status))
            //    .ForMember(dest => dest.ActorId, opt => opt.MapFrom(src => src.NotifierId))
            //    .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.NotificationObject.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss")))
            //    .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src.NotificationObject.))
            //    .ForMember(dest => dest.workspace, opt => opt.MapFrom(src => src.NotificationObject.Workspace))
            //    .ForMember(dest => dest.board, opt => opt.MapFrom(src => src.NotificationObject.Board))
            //    .ForMember(dest => dest.card, opt => opt.MapFrom(src => src.NotificationObject.Card));
        }
    }
}
