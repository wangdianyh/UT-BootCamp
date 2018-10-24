Attribute VB_Name = "printVolume"
Sub printVolume()
    Range("J1").Value = "Total Stock Volume"
    Dim find As Range

    For I = 2 To Cells(Rows.Count, "G").End(xlUp).Row
    ' For i = 2 To 267

        Set find = Range("I:I").find(What:=Cells(I, "A").Value, LookIn:=xlValues, LookAt:=xlWhole)
        Cells(find.Row, "J").Value = Cells(find.Row, "J").Value + Cells(I, "G").Value
    Next I
    MsgBox ("finish volume calculating")
End Sub
