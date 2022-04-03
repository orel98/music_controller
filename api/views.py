from django.http import JsonResponse
from django.shortcuts import render
from flask import request, session
from html5lib import serialize
from itsdangerous import Serializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer
from .models import Room

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "code"

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code:
            room = Room.objects.filter(code=code)
            if len(room):
                data = RoomSerializer(room[0]).data
                data["is_host"] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response(
                {"Room Not Found": "Invalid Room Code"},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(
            {"Bad Request": "Code paramater not found in requests"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class JoinRoom(APIView):
    lookup_url_kwarg = "code"

    def post(self, request, format=None):
        session_exists = self.request.session.exists(self.request.session.session_key)
        if not session_exists:
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code:
            room_result = Room.objects.filter(code=code)
            if len(room_result):
                room = room_result[0]
                self.request.session["room_code"] = code
                return Response({"message": "Room Joined!"}, status=status.HTTP_200_OK)

            return Response(
                {"Bad Request": "Invalid room code"}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"Bad Request": "Invalid post data, did not find 'code' key"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):

        session_exists = self.request.session.exists(self.request.session.session_key)
        if not session_exists:
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            host = self.request.session.session_key

            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                self.request.session["room_code"] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(
                    host=host,
                    guest_can_pause=guest_can_pause,
                    votes_to_skip=votes_to_skip,
                )
                room.save()
                self.request.session["room_code"] = room.code
                return Response(
                    RoomSerializer(room).data, status=status.HTTP_201_CREATED
                )
        return Response(
            {"Bad Request": "Invalid data..."}, status=status.HTTP_400_BAD_REQUEST
        )


class UserInRoom(APIView):
    def get(self, request, format=None):

        session_exists = self.request.session.exists(self.request.session.session_key)
        if not session_exists:
            self.request.session.create()
        data = {"code": self.request.session.get("room_code")}

        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoom(APIView):
    def post(self, request, format=None):
        if "room_code" in self.request.session:
            self.request.session.pop("room_code")
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results):
                room = room_results[0]
                room.delete()
        return Response({"message": "Success"}, status=status.HTTP_200_OK)


class UpdateRoom(APIView):

    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        session_exists = self.request.session.exists(self.request.session.session_key)
        if not session_exists:
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serialize.is_valid():
            code = serializer.data.get("code")
            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response(
                    {"msa": "Room not found."}, status=status.HTTP_404_NOT_FOUND
                )

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response(
                    {"msg": "You are not the host of this room."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            room.guest_can_pause = serializer.data.get("guest_can_pause")
            room.votes_to_skip = serializer.data.get("votes_to_skip")
            room.save(update_fields=["guest_can_pause", "votes_to_skip"])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response(
            {"Bad Request": "Invalid Data"}, status=status.HTTP_400_BAD_REQUEST
        )